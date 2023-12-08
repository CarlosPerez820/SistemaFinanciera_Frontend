export interface Prestamo {
    _id?: string;
    fecha?: string;
    folio?: string;
    tipoPrestamo?: string;
    nombre?: string;
    direccion?: string;
    colonia?: string;
    telefono?: string;
    cobranza?: Number;
    cantidadPrestamo?: Number;
    cantidadPagar?: Number;
    plazoPrestamo?: Number;
    totalRestante?: Number;
    pagoDiario?: Number;
    fechaPago?: string;
    proximoPago?: string;
    gestor?: string;
    tipoUltiPago?: string;
    estatus?: string;
    nota?: string;
    numeroCliente?: string;
    urlDinero?: string;
    urlPagare?: string;
    urlFachada?: string;
    estado?: boolean;
    sucursal?: string;
}