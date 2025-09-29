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
    numeroPago?: Number;
    adeudo?: Number;
    pagosPendientes?:Number;
    moras?:Number;
    saldoExtra?: Number;
    inciadoPor?: string;

    aCubrir?:Number;
    telefonoAdicional?:string;
    direccionNegocio?: string;
    tipoSolicitud?:string;
    sucursal?: string;
}

export interface PrestamosResponse {
    prestamos: Prestamo[];
  }