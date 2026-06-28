import { Router, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import pool from "../config/db";

const router = Router();
router.use(authenticate, authorize("vendor", "principal"));

// GET /api/vendor/dashboard — vendor dashboard summary
router.get("/dashboard", async (req: AuthRequest, res: Response): Promise<void> => {
  const vendorId = req.user!.id;
  const schoolId = req.user!.schoolId;

  try {
    // Sales stats
    const stats = await pool.query(
      `SELECT
         COUNT(DISTINCT so.id) FILTER (WHERE so.status != 'cancelled') as total_orders,
         COUNT(DISTINCT so.id) FILTER (WHERE so.status = 'pending') as pending_orders,
         COUNT(DISTINCT so.id) FILTER (WHERE so.status = 'delivered') as delivered_orders,
         COALESCE(SUM(so.total_amount) FILTER (WHERE so.status NOT IN ('pending','cancelled')), 0) as total_revenue,
         COALESCE(SUM(so.total_amount) FILTER (WHERE so.status = 'pending'), 0) as pending_revenue
       FROM shop_orders so
       JOIN shop_order_items soi ON soi.order_id = so.id
       JOIN shop_products sp ON sp.id = soi.product_id
       WHERE sp.vendor_id = $1 AND so.school_id = $2`,
      [vendorId, schoolId]
    );

    // Top products
    const topProducts = await pool.query(
      `SELECT sp.id, sp.name, sp.category, sp.price, sp.stock_quantity,
              COALESCE(SUM(soi.quantity), 0) as total_sold
       FROM shop_products sp
       LEFT JOIN shop_order_items soi ON soi.product_id = sp.id
       LEFT JOIN shop_orders so ON so.id = soi.order_id AND so.status != 'cancelled'
       WHERE sp.vendor_id = $1
       GROUP BY sp.id ORDER BY total_sold DESC LIMIT 10`,
      [vendorId]
    );

    // Recent orders
    const recentOrders = await pool.query(
      `SELECT so.id, so.total_amount, so.status, so.created_at, u.name as customer_name
       FROM shop_orders so
       JOIN users u ON u.id = so.customer_id
       JOIN shop_order_items soi ON soi.order_id = so.id
       JOIN shop_products sp ON sp.id = soi.product_id
       WHERE sp.vendor_id = $1
       GROUP BY so.id, u.name
       ORDER BY so.created_at DESC LIMIT 10`,
      [vendorId]
    );

    // Revenue by month (last 6 months)
    const monthlyRevenue = await pool.query(
      `SELECT TO_CHAR(so.created_at, 'YYYY-MM') as month,
              SUM(so.total_amount) as revenue,
              COUNT(so.id) as orders
       FROM shop_orders so
       JOIN shop_order_items soi ON soi.order_id = so.id
       JOIN shop_products sp ON sp.id = soi.product_id
       WHERE sp.vendor_id = $1 AND so.status NOT IN ('pending', 'cancelled')
       AND so.created_at >= NOW() - INTERVAL '6 months'
       GROUP BY month ORDER BY month ASC`,
      [vendorId]
    );

    res.json({
      stats: stats.rows[0],
      topProducts: topProducts.rows,
      recentOrders: recentOrders.rows,
      monthlyRevenue: monthlyRevenue.rows,
    });
  } catch (err) {
    console.error("Vendor dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch vendor dashboard" });
  }
});

// GET /api/vendor/products — list vendor's products
router.get("/products", async (req: AuthRequest, res: Response): Promise<void> => {
  const { limit = 50, offset = 0 } = req.query as Record<string, string>;
  try {
    const result = await pool.query(
      `SELECT sp.*,
         COALESCE((SELECT SUM(soi.quantity) FROM shop_order_items soi
           JOIN shop_orders so ON so.id = soi.order_id AND so.status != 'cancelled'
           WHERE soi.product_id = sp.id), 0) as total_sold
       FROM shop_products sp WHERE sp.vendor_id = $1
       ORDER BY sp.created_at DESC LIMIT $2 OFFSET $3`,
      [req.user!.id, Number(limit), Number(offset)]
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/vendor/orders — all orders containing vendor's products
router.get("/orders", async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, limit = 30, offset = 0 } = req.query as Record<string, string>;
  try {
    let query = `SELECT DISTINCT so.*, u.name as customer_name FROM shop_orders so
                 JOIN users u ON u.id = so.customer_id
                 JOIN shop_order_items soi ON soi.order_id = so.id
                 JOIN shop_products sp ON sp.id = soi.product_id
                 WHERE sp.vendor_id = $1`;
    const params: (string | number)[] = [req.user!.id];

    if (status) { params.push(status); query += ` AND so.status = $${params.length}`; }
    query += ` ORDER BY so.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(limit), Number(offset));

    const result = await pool.query(query, params);
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/vendor/inventory-alerts — low stock alerts
router.get("/inventory-alerts", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, stock_quantity, price FROM shop_products
       WHERE vendor_id = $1 AND stock_quantity <= 5 AND is_active = true
       ORDER BY stock_quantity ASC`,
      [req.user!.id]
    );
    res.json({ alerts: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory alerts" });
  }
});

export default router;
