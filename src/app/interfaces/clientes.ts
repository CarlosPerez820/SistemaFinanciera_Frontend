export interface Clientes {
    _id?: string;
    numeroCliente?: string;
    nombre?: string;
    edad?: string;
    direccion?: string;
    colonia?: string;
    senasDomicilio?: string;
    entrecalles?: string;
    ciudad?: string;
    celular?: string;
    telefonoFijo?: string;
    telefonoAdicional?: string;
    estadoCivil?: string;
    tiempoCasados?: string;
    dependientes?: string;
    tipoVivienda?: string;
    tiempoViviendo?: string;
    pagoRenta?: string;
    tipoNegocio?: string;
    tiempoNegocio?: string;
    numeroIdentificacion?: string;
    RFC?: string;
    nombreConyugue?: string;
    trabajoConyugue?: string;
    domicilioConyugue?: string;
    antiguedadConyugue?: string;
    ingresoSolicitante?: Number;
    ingresoConyugue?: Number;
    gastosTotales?: Number;
    gestorAsignado?: string;
    fotoPerfil?: string;
    fotoComprobante?: string;
    fotoFachada?: string;
    fotoIneFrente?: string;
    fotoIneReverso?: string;
    tipo?: string;
    fechaRegistro?: string;
    numeroPrestamos?: Number;
    
    numeroActivos?:Number;
    prestamosActivos?:Boolean;
    clasificacion?:string;
    sucursal?: string;
    puntuacion?: string;
    adeudo?: Number;
    comentarios?: string;
}

export interface ApiResponse {
  msg: string;
  cliente: {
    _id: string;
  };
}