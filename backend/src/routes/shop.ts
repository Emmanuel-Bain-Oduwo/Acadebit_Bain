import { Router, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();
router.use(authenticate);

// ── Products ──────────────────────────────────────────────────────────────────

// GET /api/shop/products — list products
router.get("/products", async (req: AuthRequest, res: Response): Promise<void> => {
  const schoolId = req.user!.schoolId;
  const { category, vendorId, limit = 30, offset = 0 } = req.query as Record<string, string>;

  try {
    let query = `SELECT sp.*, u.name as vendor_name FROM shop_products sp
                 JOIN users u ON u.id = sp.vendor_id
                 WHERE sp.school_id = $1 AND sp.is_active = true`;
    const params: (string | number)[] = [schoolId];

    if (category) { params.push(category); query += ` AND sp.category = $${params.length}`; }
    if (vendorId) { params.push(vendorId); query += ` AND sp.vendor_id = $${params.length}`; }

    query += ` ORDER BY sp.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    const total = await pool.query(
      `SELECT COUNT(*) FROM shop_products WHERE school_id = $1 AND is_active = true`,
      [schoolId]
    );

    res.json({ products: result.rows, total: Number(total.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/shop/products/:id
router.get("/products/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT sp.*, u.name as vendor_name FROM shop_products sp
       JOIN users u ON u.id = sp.vendor_id WHERE sp.id = $1`,
      [req.params.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/shop/products — create product (vendor)
router.post(
  "/products",
  authorize("vendor", "principal"),
  [
    body("name").notEmpty().isString().isLength({ max: 500 }),
    body("category").isIn(["textbook", "uniform", "lab", "stationery", "other"]),
    body("price").isNumeric({ no_symbols: false }),
    body("stockQuantity").optional().isInt({ min: 0 }),
    body("description").optional().isString(),
    body("imageUrl").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { name, category, price, stockQuantity = 0, description, imageUrl } = req.body as {
      name: string; category: string; price: number;
      stockQuantity?: number; description?: string; imageUrl?: string;
    };

    try {
      const result = await pool.query(
        `INSERT INTO shop_products (school_id, vendor_id, name, description, category, price, stock_quantity, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [req.user!.schoolId, req.user!.id, name, description, category, price, stockQuantity, imageUrl]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

// PUT /api/shop/products/:id
router.put("/products/:id", authorize("vendor", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, price, stockQuantity, imageUrl, isActive } = req.body as {
    name?: string; description?: string; price?: number;
    stockQuantity?: number; imageUrl?: string; isActive?: boolean;
  };

  try {
    const result = await pool.query(
      `UPDATE shop_products SET name = COALESCE($1, name), description = COALESCE($2, description),
       price = COALESCE($3, price), stock_quantity = COALESCE($4, stock_quantity),
       image_url = COALESCE($5, image_url), is_active = COALESCE($6, is_active)
       WHERE id = $7 AND vendor_id = $8 RETURNING *`,
      [name, description, price, stockQuantity, imageUrl, isActive, req.params.id, req.user!.id]
    );
    if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ── Orders ────────────────────────────────────────────────────────────────────

// GET /api/shop/orders — list my orders (customer) or school orders (vendor/principal)
router.get("/orders", async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, id: userId, schoolId } = req.user!;
  const { limit = 20, offset = 0, status } = req.query as Record<string, string>;

  try {
    let query = `SELECT so.*, u.name as customer_name FROM shop_orders so
                 JOIN users u ON u.id = so.customer_id WHERE `;
    const params: (string | number)[] = [];

    if (role === "vendor" || role === "principal") {
      params.push(schoolId);
      query += `so.school_id = $${params.length}`;
    } else {
      params.push(userId);
      query += `so.customer_id = $${params.length}`;
    }

    if (status) { params.push(status); query += ` AND so.status = $${params.length}`; }
    query += ` ORDER BY so.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const orders = await pool.query(query, params);

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.rows.map(async (order) => {
        const items = await pool.query(
          `SELECT soi.*, sp.name, sp.image_url FROM shop_order_items soi
           JOIN shop_products sp ON sp.id = soi.product_id
           WHERE soi.order_id = $1`,
          [order.id]
        );
        return { ...order, items: items.rows };
      })
    );

    res.json({ orders: ordersWithItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/shop/orders/:id — single order detail
router.get("/orders/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await pool.query(
      `SELECT so.*, u.name as customer_name FROM shop_orders so
       JOIN users u ON u.id = so.customer_id WHERE so.id = $1`,
      [req.params.id]
    );
    if (!order.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

    const items = await pool.query(
      `SELECT soi.*, sp.name, sp.description, sp.image_url, sp.category
       FROM shop_order_items soi JOIN shop_products sp ON sp.id = soi.product_id
       WHERE soi.order_id = $1`,
      [req.params.id]
    );

    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /api/shop/orders — place an order
router.post(
  "/orders",
  [
    body("items").isArray({ min: 1 }),
    body("items.*.productId").isUUID(),
    body("items.*.quantity").isInt({ min: 1 }),
    body("deliveryAddress").optional().isString(),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    const { items, deliveryAddress } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      deliveryAddress?: string;
    };
    const customerId = req.user!.id;
    const schoolId = req.user!.schoolId;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      let totalAmount = 0;
      const orderItems: Array<{ productId: string; quantity: number; unitPrice: number }> = [];

      for (const item of items) {
        const product = await client.query(
          `SELECT price, stock_quantity FROM shop_products WHERE id = $1 AND is_active = true FOR UPDATE`,
          [item.productId]
        );
        if (!product.rows[0]) throw new Error(`Product ${item.productId} not found`);
        if (product.rows[0].stock_quantity < item.quantity) throw new Error(`Insufficient stock for product ${item.productId}`);

        totalAmount += Number(product.rows[0].price) * item.quantity;
        orderItems.push({ productId: item.productId, quantity: item.quantity, unitPrice: Number(product.rows[0].price) });

        await client.query(
          `UPDATE shop_products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
          [item.quantity, item.productId]
        );
      }

      const order = await client.query(
        `INSERT INTO shop_orders (school_id, customer_id, total_amount, delivery_address)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [schoolId, customerId, totalAmount, deliveryAddress]
      );

      for (const item of orderItems) {
        await client.query(
          `INSERT INTO shop_order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [order.rows[0].id, item.productId, item.quantity, item.unitPrice]
        );
      }

      await client.query("COMMIT");
      res.status(201).json({ order: order.rows[0], items: orderItems });
    } catch (err: unknown) {
      await client.query("ROLLBACK");
      const message = err instanceof Error ? err.message : "Failed to place order";
      res.status(400).json({ error: message });
    } finally {
      client.release();
    }
  }
);

// PATCH /api/shop/orders/:id/status — update order status (vendor/principal)
router.patch(
  "/orders/:id/status",
  authorize("vendor", "principal"),
  [body("status").isIn(["pending", "paid", "processing", "shipped", "delivered", "cancelled"])],
  async (req: AuthRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return; }

    try {
      const result = await pool.query(
        `UPDATE shop_orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [req.body.status, req.params.id]
      );
      if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  }
);

// GET /api/shop/vendor/stats — vendor sales stats
router.get("/vendor/stats", authorize("vendor", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const vendorId = req.user!.id;
  try {
    const stats = await pool.query(
      `SELECT COUNT(DISTINCT so.id) as total_orders,
              SUM(so.total_amount) as total_revenue,
              COUNT(DISTINCT so.customer_id) as unique_customers,
              AVG(so.total_amount) as avg_order_value
       FROM shop_orders so
       JOIN shop_order_items soi ON soi.order_id = so.id
       JOIN shop_products sp ON sp.id = soi.product_id
       WHERE sp.vendor_id = $1`,
      [vendorId]
    );

    const topProducts = await pool.query(
      `SELECT sp.name, sp.category, SUM(soi.quantity) as total_sold, SUM(soi.unit_price * soi.quantity) as revenue
       FROM shop_order_items soi JOIN shop_products sp ON sp.id = soi.product_id
       WHERE sp.vendor_id = $1
       GROUP BY sp.name, sp.category ORDER BY revenue DESC LIMIT 5`,
      [vendorId]
    );

    res.json({ stats: stats.rows[0], topProducts: topProducts.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendor stats" });
  }
});

export default router;
