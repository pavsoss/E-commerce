const db =
    require("../config/db");

// create order service
const createOrderService =
    (
        orderData
    ) => {
        return new Promise(
            (
                resolve,
                reject
            ) => {
                db.getConnection(
                    (
                        connectionError,
                        connection
                    ) => {
                        if (
                            connectionError
                        ) {
                            return reject(
                                connectionError
                            );
                        }

                        connection.beginTransaction(
                            async (
                                transactionError
                            ) => {
                                if (
                                    transactionError
                                ) {
                                    connection.release();
                                    return reject(
                                        transactionError
                                    );
                                }

                                try {
                                    const {
                                        user_id,
                                        customer_name,
                                        customer_email,
                                        customer_phone,
                                        city,
                                        state,
                                        zip,
                                        full_address,
                                        payment_method,
                                        total,
                                        items
                                    } =
                                        orderData;

                                    // create order
                                    const orderQuery = `
                                        INSERT INTO orders
                                        (
                                            user_id,
                                            customer_name,
                                            customer_email,
                                            customer_phone,
                                            city,
                                            state,
                                            zip,
                                            full_address,
                                            payment_method,
                                            total
                                        )
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                    `;

                                    connection.query(
                                        orderQuery,
                                        [
                                            user_id,
                                            customer_name,
                                            customer_email,
                                            customer_phone,
                                            city,
                                            state,
                                            zip,
                                            full_address,
                                            payment_method,
                                            total
                                        ],
                                        (
                                            orderError,
                                            orderResult
                                        ) => {
                                            if (
                                                orderError
                                            ) {
                                                return connection.rollback(
                                                    () => {
                                                        connection.release();
                                                        reject(
                                                            orderError
                                                        );
                                                    }
                                                );
                                            }

                                            const orderId =
                                                orderResult.insertId;

                                            // insert items
                                            const itemPromises =
                                                items.map(
                                                    (
                                                        item
                                                    ) => {
                                                        return new Promise(
                                                            (
                                                                itemResolve,
                                                                itemReject
                                                            ) => {
                                                                const itemQuery = `
                                                                    INSERT INTO order_items
                                                                    (
                                                                        order_id,
                                                                        product_id,
                                                                        name,
                                                                        price,
                                                                        qty,
                                                                        color,
                                                                        size
                                                                    )
                                                                    VALUES (?, ?, ?, ?, ?, ?, ?)
                                                                `;

                                                                connection.query(
                                                                    itemQuery,
                                                                    [
                                                                        orderId,
                                                                        item.id,
                                                                        item.name,
                                                                        item.price,
                                                                        item.qty,
                                                                        item.color,
                                                                        item.size
                                                                    ],
                                                                    (
                                                                        itemError
                                                                    ) => {
                                                                        if (
                                                                            itemError
                                                                        ) {
                                                                            return itemReject(
                                                                                itemError
                                                                            );
                                                                        }

                                                                        // update stock
                                                                        const stockQuery = `
                                                                            UPDATE products
                                                                            SET stock = stock - ?
                                                                            WHERE id = ?
                                                                            AND stock >= ?
                                                                        `;

                                                                        connection.query(
                                                                            stockQuery,
                                                                            [
                                                                                item.qty,
                                                                                item.id,
                                                                                item.qty
                                                                            ],
                                                                            (
                                                                                stockError,
                                                                                stockResult
                                                                            ) => {
                                                                                if (
                                                                                    stockError
                                                                                ) {
                                                                                    return itemReject(
                                                                                        stockError
                                                                                    );
                                                                                }

                                                                                if (
                                                                                    stockResult.affectedRows === 0
                                                                                ) {
                                                                                    return itemReject(
                                                                                        new Error(
                                                                                            `Insufficient stock for ${item.name}`
                                                                                        )
                                                                                    );
                                                                                }

                                                                                itemResolve();
                                                                            }
                                                                        );
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );

                                            Promise.all(
                                                itemPromises
                                            )
                                                .then(
                                                    () => {
                                                        connection.commit(
                                                            (
                                                                commitError
                                                            ) => {
                                                                if (
                                                                    commitError
                                                                ) {
                                                                    return connection.rollback(
                                                                        () => {
                                                                            connection.release();
                                                                            reject(
                                                                                commitError
                                                                            );
                                                                        }
                                                                    );
                                                                }

                                                                connection.release();

                                                                resolve({
                                                                    success: true,
                                                                    orderId
                                                                });
                                                            }
                                                        );
                                                    }
                                                )

                                                .catch(
                                                    (
                                                        itemError
                                                    ) => {
                                                        connection.rollback(
                                                            () => {
                                                                connection.release();
                                                                reject(
                                                                    itemError
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                        }
                                    );
                                } catch (
                                    error
                                ) {
                                    connection.rollback(
                                        () => {
                                            connection.release();
                                            reject(
                                                error
                                            );
                                        }
                                    );
                                }
                            }
                        );
                    }
                );
            }
        );
    };

module.exports = {
    createOrderService
};