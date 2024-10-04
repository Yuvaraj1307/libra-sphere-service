import { Router } from "express";
import { auth, books, borrowRequests, borrowedBooks, healthCheck, libraries, users, dashboard, userInfo } from "./controller/routes"
import { roleAuthorization } from "./middleware/roles/middleware";
import { verifyToken } from "./middleware/auth/middleware";

const router = Router();
router.use(
    "/auth",
    auth,
);
router.use(
    "/health-check",
    verifyToken, healthCheck,
);
router.use(
    "/books",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'librarian', 'member', 'admin']),
    books,
);
router.use(
    "/borrow-requests",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'member', 'librarian']),
    borrowRequests,
);
router.use(
    "/borrowed-books",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'librarian', 'member']),
    borrowedBooks,
);
router.use(
    "/libraries",
    verifyToken,
    roleAuthorization(['admin', 'super_admin']),
    libraries,
);
router.use(
    "/users",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'librarian', 'admin']),
    users,
);
router.use(
    "/dashboard",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'librarian', 'admin', 'member']),
    dashboard,
);
router.use(
    "/user-info",
    verifyToken,
    roleAuthorization(['super_admin', 'admin', 'librarian', 'admin', 'member']),
    userInfo,
);

export default router;