export interface Pago {
    _id?: number;
    fecha?: string;
    folio?: string;
    nombreCliente?: string;
    numCliente?: string;
    cobranza?: Number;
    cantidadPrestamo?: Number;
    plazo?: Number;
    totalPagar?: Number;
    totalRestante?: Number;
    pagoDiario?: Number;
    folioPrestamo?: string;
    fechaPago?: string;
    horaPago?:string;
    gestor?: string;
    tipo?:string;
    comentario?:string;
    abono?: Number;
    personasCobrador?: string;
    estado?: string;
    numeroPago?: number;

    adeudo?: number;
    pagosPendiente?: number;
    mora?: number;
    extra?: Number;
    saldoExtra?:Number;
    real?:Number,
    sucursal?: string;

    metodo?:string;
}