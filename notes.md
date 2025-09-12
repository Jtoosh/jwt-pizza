# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |   home.tsx         |     *none*        | *none*       |
| Register new user<br/>(t@jwt.com, pw: test)         |   register.tsx     | [POST] /api/auth  | INSERT INTO user (name, email, password) VALUES (?, ?, ?) INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)             |
| Login new user<br/>(t@jwt.com, pw: test)            |   login.tsx        | [PUT] /api/auth   | Find user: SELECT * FROM user WHERE email=? <br/> Find user's role: SELECT * FROM userRole WHERE userId=? |
| Order pizza                                         | menu.tsx + payment.tsx | [POST] /api/order | Insert order into diner's data: INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now( )), [user.id, order.franchiseId, order.storeId] <br/> Insert data into order: INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?), [orderId, menuId, item.description, item.price]|
| Verify pizza                                        |  delivery.tsx | [POST] /api/order/verify |   *none*   |
| View profile page                                   | dinerDashboard.tsx | [GET] /api/order  | Get orders from all applicable diners: SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT \${offset},\${config.db.listPerPage} <br/> Get info for all user orders: SELECT id, menuId, description, price FROM orderItem WHERE orderId=?             |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx | *none*| *none*|
| Logout                                              |  logout.tsx        |[DELETE] /api/auth | DELETE FROM auth WHERE token=?|
| View About page                                     | about.tsx          | *none*            | *none*       |
| View History page                                   | history.tsx        | *none*            | *none*       |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.tsx          | [PUT] /api/auth   | Find user: SELECT * FROM user WHERE email=? <br/> Find user's role: SELECT * FROM userRole WHERE userId=? |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx| [GET] /api/franchise/${user.id}|Get userRole for franchisee: SELECT objectId FROM userRole WHERE role='franchisee' AND userId=? <br/> Get franchise data: SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')})|
| Create a store                                      |  createStore.tsx   | [POST] /api/franchise/\${franchise.id}/store| INSERT INTO store (franchiseId, name) VALUES (?, ?)|
| Close a store                                       |  closeStore.tsx    | [DELETE] /api/franchise/\${franchise.id}/store/\${store.id}| DELETE FROM store WHERE franchiseId=? AND id=? |
| Login as admin<br/>(a@jwt.com, pw: admin)           |  login.tsx         |  [PUT] /api/auth  | Find user: SELECT * FROM user WHERE email=? <br/> Find user's role: SELECT * FROM userRole WHERE userId=? |
| View Admin page                                     | adminDashboard.tsx | [GET] /api/franchise?page=\${page}\&limit=\${limit}\&name=$\{nameFilter} | Get all franchise data: SELECT id, name FROM franchise WHERE name LIKE ? LIMIT \${limit + 1} OFFSET \${offset} <br/> Join and format all franchise data: <br/> SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee' <br/> SELECT s.id, s.name, COALESCE(SUM(oi.price), 0) AS totalRevenue FROM dinerOrder AS do JOIN orderItem AS oi ON do.id=oi.orderId RIGHT JOIN store AS s ON s.id=do.storeId WHERE s.franchiseId=? GROUP BY s.id  <br/>            |
| Create a franchise for t@jwt.com                    | createFranchise.tsx | [POST] /api/franchise | Verify franchise admin user exists: SELECT id, name FROM user WHERE email=? <br/> Create franchise: INSERT INTO franchise (name) VALUES (?) <br/> Set franchise admin user as franchisee: INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)|
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | [DELETE] /api/franchise/\${franchise.id} | Delete the franchise's stores: DELETE FROM store WHERE franchiseId=? <br/> Remove franchisee role from franchise admin user: DELETE FROM userRole WHERE objectId=? <br/> Delete franchise: DELETE FROM franchise WHERE id=? |

## Other notes

In trying to understand how the headers and footers are populated, it looks like all possible locations (endpoints) are simply stored as objects in an array called `navItems` which specifies things about them, like constraints that need to be met to be rendered, and where they are supposed to be rendered. I need to do some more digging to see if this is a common tactic and if it has a more technical name.