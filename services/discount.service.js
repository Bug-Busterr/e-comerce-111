import Discount from '../models/discount/discount.model.js';

export class DiscountService {
    static async validateAndApplyDiscount(discountCode, originalAmount) {
        try {
            const discount = await Discount.findOne({
                code: discountCode.toUpperCase(),
                isActive: true,
                inactive: false,
                expiresAt: { $gt: new Date() }
            });

            if (!discount) {
                return {
                    isValid: false,
                    error: "Invalid or expired discount code",
                    discountAmount: 0,
                    finalAmount: originalAmount
                };
            }
            const discountAmount = (originalAmount * discount.percentage) / 100;
            const finalAmount = originalAmount - discountAmount;

            return {
                isValid: true,
                discount: discount,
                discountAmount: Math.round(discountAmount * 100) / 100,
                finalAmount: Math.round(finalAmount * 100) / 100,
                discountPercentage: discount.percentage
            };

        } catch (error) {
            return {
                isValid: false,
                error: "Error validating discount code",
                discountAmount: 0,
                finalAmount: originalAmount
            };
        }
    }
    static async getActiveDiscounts() {
        try {
            const discounts = await Discount.find({
                isActive: true,
                inactive: false,
                expiresAt: { $gt: new Date() }
            }).select('code percentage description expiresAt');

            return discounts;
        } catch (error) {
            throw new Error('Error fetching active discounts');
        }
    }
    static async validateDiscountCode(discountCode) {
        try {
            const discount = await Discount.findOne({
                code: discountCode.toUpperCase(),
                isActive: true,
                inactive: false,
                expiresAt: { $gt: new Date() }
            });

            if (!discount) {
                return {
                    isValid: false,
                    message: "Invalid or expired discount code"
                };
            }

            return {
                isValid: true,
                discount: {
                    code: discount.code,
                    percentage: discount.percentage,
                    description: discount.description,
                    expiresAt: discount.expiresAt
                },
                message: `Valid discount code: ${discount.percentage}% off`
            };

        } catch (error) {
            return {
                isValid: false,
                message: "Error validating discount code"
            };
        }
    }
}
