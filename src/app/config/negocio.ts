export const NEGOCIO = {
  nombre: 'Mojojitos',
  // Número con código de país, sin +, espacios ni guiones
  whatsapp: '56912345678',
  metodosPago: ['Efectivo', 'Transferencia'],

  // Pedidos programados: se confirman por WhatsApp
  reservas: {
    apertura: '12:00',
    cierre: '22:00', // último horario que se puede elegir = cierre - intervalo
    intervaloMinutos: 30,
    anticipacionMinutos: 120, // mínimo de anticipación para programar
    diasMaximos: 14, // hasta cuántos días hacia adelante
    diasCerrado: [] as number[], // 0 = domingo, 1 = lunes ... 6 = sábado
  },
};