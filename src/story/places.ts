/** Cartografía especulativa: posiciones escénicas, NO coordenadas reales de Bogotá. */
export interface Lugar {
  id:string; nombre:string; short:string; region:string;
  lat:number; lon:number; color:number; descripcion:string;
  mood:'calma'|'bohemia'|'poder'|'sombra'|'ciudad';
}
export const LUGARES: Lugar[] = [
  {id:'apartamento',nombre:'Apartamento de La Soledad',short:'La Soledad',region:'Intimidad',lat:12,lon:0,color:0xb88968,mood:'calma',descripcion:'Escobar, Fina y el poema que nunca comienza.'},
  {id:'taller',nombre:'Taller de Diego León',short:'El taller',region:'Bohemia',lat:32,lon:43,color:0xa9744b,mood:'bohemia',descripcion:'La pintura, el ajedrez y la revolución de salón.'},
  {id:'oasis',nombre:'Bar El Oasis',short:'El Oasis',region:'Bohemia',lat:3,lon:82,color:0x94584b,mood:'bohemia',descripcion:'Boleros, humo y una mesa llena de poetas.'},
  {id:'septima',nombre:'Carrera Séptima',short:'La Séptima',region:'Tránsito',lat:-26,lon:118,color:0x697888,mood:'ciudad',descripcion:'Asfalto mojado y una ciudad que nunca deja de hablar.'},
  {id:'parque',nombre:'Parque Nacional',short:'El parque',region:'Deriva',lat:22,lon:149,color:0x668c68,mood:'calma',descripcion:'Senderos, conversaciones y encuentros imprevistos.'},
  {id:'porciuncula',nombre:'Iglesia de la Porciúncula',short:'La Porciúncula',region:'Rito',lat:44,lon:191,color:0xc2b39a,mood:'poder',descripcion:'El ritual religioso y el político comparten calendario.'},
  {id:'jockey',nombre:'Jockey Club',short:'Jockey Club',region:'Élite',lat:7,lon:220,color:0xd1b57d,mood:'poder',descripcion:'El decorado dorado de una clase que se reconoce.'},
  {id:'casa_familiar',nombre:'Casa familiar',short:'La casa familiar',region:'Élite',lat:-25,lon:249,color:0xbba182,mood:'poder',descripcion:'Un apellido, varias generaciones y una misma mesa.'},
  {id:'oficina',nombre:'La oficina',short:'La oficina',region:'Rutina',lat:-9,lon:291,color:0x9fa79f,mood:'ciudad',descripcion:'Papeles, informes y el oficio de aplazar.'},
  {id:'unicornio',nombre:'Club El Unicornio',short:'El Unicornio',region:'Noche',lat:27,lon:323,color:0xbf80a6,mood:'bohemia',descripcion:'Cabaret, clase y una bailarina descalza.'},
  {id:'cementerio',nombre:'Cementerio Central',short:'El cementerio',region:'Muerte',lat:-42,lon:337,color:0x898b85,mood:'sombra',descripcion:'Las esquelas sobreviven a sus destinatarios.'},
  {id:'cerros',nombre:'Cerros Orientales',short:'Los cerros',region:'Horizonte',lat:61,lon:2,color:0x5d866d,mood:'calma',descripcion:'Monserrate, Guadalupe y el cielo que anuncia lluvia.'}
];
export const DEG=Math.PI/180;
export function dir(lat:number,lon:number):[number,number,number]{let a=lat*DEG,b=lon*DEG;return [Math.cos(a)*Math.sin(b),Math.sin(a),Math.cos(a)*Math.cos(b)];}
