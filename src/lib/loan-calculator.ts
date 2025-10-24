import { Payment } from '../payments/payment.entity';

export interface LoanSchedule {
  payments: Payment[];
  totalInterest: number;
  totalPaid: number;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Calcular la tasa de interés mensual desde la tasa efectiva anual
export function calculateMonthlyRate(annualRate: number): number {
  // Convertir tasa efectiva anual a tasa mensual
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

// Calcular la cuota fija mensual (sin seguro)
export function calculateFixedPayment(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) return principal / months;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return payment;
}

// Calcular el saldo de capital restante
export function calculateRemainingBalance(
  principal: number,
  monthlyRate: number,
  payment: number,
  monthsPaid: number,
): number {
  let balance = principal;

  for (let i = 0; i < monthsPaid; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = payment - interest;
    balance -= principalPayment;
  }

  return Math.max(0, balance);
}
