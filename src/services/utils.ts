export const formatNumber = (number: number, currency?: 'NGN' | 'USD') => {
   if (Number.isNaN(number)) {number=0;}
    
    return number.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        ...(currency ? { currency, style: 'currency' } : null),
    });
}