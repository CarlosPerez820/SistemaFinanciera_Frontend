export interface Pago {
    _id?: number;
    fecha?: string
    folio?: string;     //no
    nombreCliente?: string;
    numCliente?: string;
    cobranza?: Number; //no
    cantidadPrestamo?: Number;      //no
    plazo?: Number;         //no
    totalPagar?: Number;    //no
    totalRestante?: Number;
    pagoDiario?: Number;
    folioPrestamo?: string;     //no
    fechaPago?: string;     //no
    horaPago?:string;
    gestor?: string;        //no
    tipo?:string;
    comentario?:string;       //no
    abono?: Number;     
    personasCobrador?: string;
    estado?: string;
    numeroPago?: number;

    adeudo?: number;                
    pagosPendiente?: number;    //no
    mora?: number;          
    extra?: Number;             //No
    saldoExtra?:Number;
    real?:Number,               //NO
    sucursal?: string;
    metodo?:string;             
}