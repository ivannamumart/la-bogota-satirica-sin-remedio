/** Tipos de la dramaturgia espacial.
 * La única fuente activa de episodios es expanded.ts. Evitar duplicar o mezclar
 * versiones anteriores del guion con atribuciones incorrectas.
 */
export interface Linea {
  voz:string;
  texto:string;
  fuente?:string;
  interpretativa?:boolean;
  tipo?:'accion'|'dialogo';
  foco?:string;
}
export interface EscenaTexto {
  inicio:Linea[];
  bifurcaciones:{titulo:string;contexto?:string;lineas:Linea[]}[];
}
