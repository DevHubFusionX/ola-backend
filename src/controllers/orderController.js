const Order = require('../../models/Order');

const nodemailer = require('nodemailer');

exports.createOrder = async (req, res) => {
    try {
        let { customer, items, totalAmount, paymentMethod, deliveryMethod } = req.body;

        // Parse strings if multipart/form-data
        if (typeof customer === 'string') customer = JSON.parse(customer);
        if (typeof items === 'string') items = JSON.parse(items);
        if (typeof totalAmount === 'string') totalAmount = parseFloat(totalAmount);

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const receiptImage = req.file ? req.file.path : null;
        const receiptCloudinaryId = req.file ? req.file.public_id : null;

        // Map items for the database (using only the product ID)
        const dbItems = items.map(item => ({
            ...item,
            product: (item.product && item.product._id) ? item.product._id : item.product
        }));

        const order = new Order({
            customer,
            items: dbItems,
            totalAmount,
            paymentMethod,
            deliveryMethod,
            receiptImage,
            receiptCloudinaryId
        });

        const savedOrder = await order.save();

        // Send Email Notification to Admin
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Olaluxe Orders" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Order Received - #${savedOrder.orderNumber}`,
            html: `
                <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; border: 1px solid #f3e5d8; padding: 30px; border-radius: 20px;">
                    <h1 style="color: #c5a059; border-bottom: 2px solid #f3e5d8; padding-bottom: 10px;">New Order: #${savedOrder.orderNumber}</h1>
                    
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #9b7e45; font-size: 18px;">Customer Information</h2>
                        <p><strong>Name:</strong> ${customer.name}</p>
                        <p><strong>Email:</strong> ${customer.email}</p>
                        <p><strong>Phone:</strong> ${customer.phone}</p>
                        <p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state}</p>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #9b7e45; font-size: 18px;">Order Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #fdfaf7;">
                                    <th style="padding: 10px; border: 1px solid #f3e5d8; text-align: left;">Item</th>
                                    <th style="padding: 10px; border: 1px solid #f3e5d8; text-align: center;">Qty</th>
                                    <th style="padding: 10px; border: 1px solid #f3e5d8; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${items.map(item => `
                                    <tr>
                                        <td style="padding: 10px; border: 1px solid #f3e5d8;">
                                            ${item.product.name || 'Product'} 
                                            <div style="font-size: 12px; color: #666;">
                                                ${item.color ? `Color: ${item.color}` : ''} 
                                                ${item.size ? `• Size: ${item.size}` : ''}
                                            </div>
                                        </td>
                                        <td style="padding: 10px; border: 1px solid #f3e5d8; text-align: center;">${item.quantity}</td>
                                        <td style="padding: 10px; border: 1px solid #f3e5d8; text-align: right;">₦${item.price.toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 10px; font-weight: bold; text-align: right;">Total Amount:</td>
                                    <td style="padding: 10px; font-weight: bold; text-align: right; color: #c5a059; font-size: 18px;">₦${totalAmount.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div style="margin-bottom: 25px; padding: 15px; background-color: #fdfaf7; border-radius: 10px;">
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                        <p><strong>Delivery Method:</strong> ${deliveryMethod}</p>
                    </div>

                    ${receiptImage ? `
                        <div style="margin-top: 25px; border-top: 1px solid #f3e5d8; pt: 20px;">
                            <h2 style="color: #9b7e45; font-size: 18px;">Payment Proof</h2>
                            <p style="font-size: 14px; margin-bottom: 10px;">Bank transfer receipt attached and shown below:</p>
                            <img src="${receiptImage}" alt="Payment Receipt" style="max-width: 100%; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
                        </div>
                    ` : ''}

                    <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                        <p>Order processed through Olaluxe Admin Platform</p>
                    </div>
                </div>
            `,
            attachments: receiptImage ? [
                {
                    filename: 'payment-receipt.jpg',
                    path: receiptImage
                }
            ] : []
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Email send error:', error);
            else console.log('Order notification email sent:', info.response);
        });

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};
