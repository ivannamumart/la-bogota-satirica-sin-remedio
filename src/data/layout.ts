/** Planta narrativa V04: x=oriente y z=-norte; unidad escénica ficticia (no EPSG). */
export type PlaceId='apartamento'|'taller'|'oasis'|'unicornio'|'jockey'|'porciuncula'|'parque'|'casa_familiar'|'oficina'|'cementerio'|'septima'|'cerros';
export type PlaceDef={id:PlaceId;name:string;area:string;x:number;z:number;scale:number;scene:boolean;kind:'domestico'|'bohemio'|'institucional'|'paisaje'|'urbano'|'ritual'|'nocturno'|'memoria'};
export const PLACES:PlaceDef[]=[
 {id:'apartamento',name:'LA SOLEDAD',area:'Apartamento de Ignacio y Fina',x:-6.45,z:-1.95,scale:1.18,scene:true,kind:'domestico'},
 {id:'taller',name:'TALLER DE DIEGO LEÓN',area:'Taller de arte y ajedrez',x:-6.75,z:1.45,scale:1.10,scene:true,kind:'bohemio'},
 {id:'oasis',name:'EL OASIS',area:'Bar y poetas',x:-4.15,z:4.35,scale:1.16,scene:true,kind:'bohemio'},
 {id:'septima',name:'CARRERA SÉPTIMA',area:'Tránsito, lluvia y voces',x:.15,z:1.05,scale:1.04,scene:true,kind:'urbano'},
 {id:'parque',name:'PARQUE NACIONAL',area:'El parque y los paseantes',x:-1.45,z:-2.05,scale:1.12,scene:true,kind:'paisaje'},
 {id:'porciuncula',name:'LA PORCIÚNCULA',area:'Atrio y ritual',x:2.65,z:-6.10,scale:1.16,scene:true,kind:'ritual'},
 {id:'jockey',name:'JOCKEY CLUB',area:'La ceremonia de la élite',x:1.65,z:7.22,scale:1.14,scene:true,kind:'institucional'},
 {id:'casa_familiar',name:'CASA DE DOÑA LEONOR',area:'La casa familiar de Ignacio',x:-4.62,z:-6.23,scale:1.34,scene:true,kind:'domestico'},
 {id:'oficina',name:'LA OFICINA',area:'La rutina',x:4.55,z:4.65,scale:1.00,scene:true,kind:'urbano'},
 {id:'unicornio',name:'EL UNICORNIO',area:'Noche y contradicciones',x:-1.10,z:-8.62,scale:1.38,scene:true,kind:'nocturno'},
 {id:'cementerio',name:'CEMENTERIO CENTRAL',area:'Muerte y memoria',x:-7.72,z:5.26,scale:.68,scene:true,kind:'memoria'},
 {id:'cerros',name:'CERROS ORIENTALES',area:'Horizonte no transitable',x:8.35,z:-.45,scale:1.00,scene:false,kind:'paisaje'}
];
export type NodeDef={id:string;x:number;z:number;entry?:PlaceId;label?:string};
// Vías interconectadas: Séptima N-S, Calle 26 E-O, ramales barriales. 
export const NODES:NodeDef[]=[
 {id:'s0',x:.0,z:7.8,label:'Séptima / centro'}, {id:'s1',x:.0,z:4.2,label:'Séptima / Calle 26'},
 {id:'s2',x:.0,z:1.0,label:'Séptima / Parque'}, {id:'s3',x:.0,z:-2.45,label:'Séptima / Chapinero'},
 {id:'s4',x:.0,z:-5.35,label:'Séptima / Porciúncula'}, {id:'s5',x:-.25,z:-7.75,label:'Séptima / norte'},
 {id:'w0',x:-8.0,z:4.3,label:'Calle 26 / occidente'}, {id:'w1',x:-5.9,z:4.25},
 {id:'w2',x:-3.35,z:4.15}, {id:'e1',x:3.35,z:4.2}, {id:'e2',x:5.95,z:4.35},
 {id:'n1',x:-5.35,z:-.25}, {id:'n2',x:-4.55,z:-4.0}, {id:'n3',x:-3.55,z:-6.05},
 {id:'n4',x:-2.25,z:-7.75}, {id:'n5',x:3.55,z:-6.10},
 {id:'jockey-door',x:1.55,z:6.55,entry:'jockey'},
 {id:'cemetery-door',x:-7.64,z:4.92,entry:'cementerio'},
 {id:'oasis-door',x:-4.10,z:4.05,entry:'oasis'},
 {id:'office-door',x:4.42,z:4.30,entry:'oficina'},
 {id:'septima-door',x:.80,z:1.00,entry:'septima'},
 {id:'parque-door',x:-1.38,z:-1.92,entry:'parque'},
 {id:'taller-door',x:-6.40,z:1.28,entry:'taller'},
 {id:'apartment-door',x:-6.08,z:-1.82,entry:'apartamento'},
 {id:'family-door',x:-4.42,z:-5.88,entry:'casa_familiar'},
 {id:'porciuncula-door',x:2.52,z:-5.80,entry:'porciuncula'},
 {id:'unicornio-door',x:-1.15,z:-8.28,entry:'unicornio'},
 {id:'s3w',x:-2.95,z:-2.45},
 {id:'w3',x:-6.0,z:1.6},
];
export type EdgeDef={from:string;to:string;kind:'septima'|'veintiseis'|'barrio'|'sendero';control?:[number,number][]};
export const EDGES:EdgeDef[]=[
 {from:'s0',to:'s1',kind:'septima'}, {from:'s1',to:'s2',kind:'septima'}, {from:'s2',to:'s3',kind:'septima'},
 {from:'s3',to:'s4',kind:'septima'}, {from:'s4',to:'s5',kind:'septima'},
 {from:'w0',to:'w1',kind:'veintiseis'}, {from:'w1',to:'w2',kind:'veintiseis'}, {from:'w2',to:'s1',kind:'veintiseis'},
 {from:'s1',to:'e1',kind:'veintiseis'}, {from:'e1',to:'e2',kind:'veintiseis'},
 {from:'w1',to:'w3',kind:'barrio'}, {from:'w3',to:'n1',kind:'barrio'}, {from:'n1',to:'n2',kind:'barrio'},
 {from:'n2',to:'n3',kind:'barrio'}, {from:'n3',to:'n4',kind:'barrio'}, {from:'n4',to:'s5',kind:'barrio'},
 {from:'n1',to:'s2',kind:'barrio',control:[[-2.4,-.62]]},
 {from:'s3',to:'s3w',kind:'barrio'}, {from:'s3w',to:'n2',kind:'barrio'},
 {from:'w2',to:'s3w',kind:'barrio',control:[[-2.8,1.1]]},
 {from:'s4',to:'n5',kind:'barrio'}, {from:'n5',to:'e1',kind:'barrio',control:[[4.15,-2.5]]},
 {from:'w0',to:'cemetery-door',kind:'sendero'},
 {from:'w2',to:'oasis-door',kind:'sendero'},
 {from:'e1',to:'office-door',kind:'sendero'},
 {from:'s0',to:'jockey-door',kind:'sendero'},
 {from:'s2',to:'septima-door',kind:'sendero'},
 {from:'s2',to:'parque-door',kind:'sendero'},
 {from:'w3',to:'taller-door',kind:'sendero'},
 {from:'n1',to:'apartment-door',kind:'sendero'},
 {from:'n3',to:'family-door',kind:'sendero'},
 {from:'n5',to:'porciuncula-door',kind:'sendero'},
 {from:'s5',to:'unicornio-door',kind:'sendero'},
];
export const DECOR=[
 {id:'plaza_toros',x:1.25,z:2.55,label:'Plaza de Toros La Santamaría'},
 {id:'torres_parque',x:3.65,z:1.35,label:'Torres del Parque · 1970'},
 {id:'tequendama',x:5.83,z:6.00,label:'Centro Internacional Tequendama'},
 {id:'museo_nacional',x:-1.65,z:2.50,label:'Museo Nacional'}
] as const;
export const R=12;
export const CAP_R=10.2;
