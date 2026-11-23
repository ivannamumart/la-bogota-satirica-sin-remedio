/** V08 · Guiones breves para escenas situadas. Los momentos P- proceden del
 * corpus aportado por la autora. Las acotaciones para visualización son paráfrasis
 * editoriales, NO citas literales. Las ramas son ficción interpretativa.
 * Un número P- identifica un párrafo del corpus, nunca una cronología añadida.
 */
import type {Linea} from './dialogues';
export interface Rama {titulo:string;contexto:string;lineas:Linea[]}
export interface Escena {inicio:Linea[];bifurcaciones:Rama[]}
const C=(voz:string,texto:string,fuente:string,foco?:string):Linea=>({voz,texto,fuente,tipo:'dialogo',foco});
const A=(texto:string,fuente?:string,foco?:string):Linea=>({voz:'',texto,fuente,interpretativa:true,tipo:'accion',foco});
const I=(voz:string,texto:string,foco?:string):Linea=>({voz,texto,interpretativa:true,tipo:'dialogo',foco});
const B=(titulo:string,contexto:string,lines:Linea[]):Rama=>({titulo,contexto,lineas:lines});
export const DIALOGOS:Record<string,Escena>={
 apartamento:{inicio:[
  A('Amanece sobre La Soledad. Un motor despierta la calle y la luz alcanza la cama deshecha.','P-3'),
  A('Ignacio mira el techo; Fina continúa dormida a su lado.','P-1 / P-2'),
  A('A los treinta y un años Rimbaud estaba muerto.','P-1'),
  A('Le tapa un instante la nariz a Fina. Ella se revuelve, vuelve a respirar y sigue durmiendo.','P-2'),
  A('La ciudad aumenta su ruido. Ignacio no logra escapar de la mañana.','P-3'),
  C('Escobar','¡Tráeme hierba!','P-28'),
  A('El apartamento conserva su desorden. La poesía todavía no empieza.','P-28')
 ],bifurcaciones:[
  B('El oficio de no escribir','¿Qué pasa cuando el prestigio literario sustituye a la página escrita?',[
   A('En la mesa del café se anuncia un premio que nadie ha leído.'),I('Escobar','El jurado debió premiar la intención; publicar es una vulgaridad.'),I('Fina','En ese caso llevas años de ventaja.'),A('Ignacio vuelve al papel vacío. La frase ha perdido la mañana.')]),
  B('La moral doméstica','La convivencia como disputa entre grandes ideas y tareas pequeñas.',[
   I('Escobar','He llegado a una conclusión filosófica sobre nuestra convivencia.'),I('Fina','Magnífico. ¿Puedes llegar también a la cocina?'),A('Un plato permanece inmóvil entre dos teorías de la libertad.')]),
  B('La memoria selectiva','¿Quién puede narrar una casa sin decidir qué historias borrar?',[
   A('Ignacio trata de reconstruir la discusión del día anterior.'),I('Fina','Qué curioso: en tu versión nadie interrumpe salvo yo.'),I('Escobar','La memoria exige ciertas licencias poéticas.'),I('Fina','La convivencia exige algo menos de licencia.')])
 ]},
 taller:{inicio:[
  A('En el taller se mezclan lienzos, olor a trementina y un tablero de ajedrez.','P-727 / P-729'),
  A('Las piezas quedan suspendidas entre una jugada y una discusión política.','P-729'),
  C('Federico','Huele a mierda, Escobar.','P-727'),
  C('Ana María','Escobar ya no sabe qué echarse.','P-728'),
  C('Diego León','Nada cura el hedor de la corrupción burguesa.','P-729'),
  A('Diego León observa el tablero. Nadie parece dispuesto a ceder su turno.','P-729')
 ],bifurcaciones:[
  B('La asamblea de los propietarios','La retórica revolucionaria ante la propiedad privada.',[
   A('Comienza una asamblea en un salón prestado por una familia acomodada.'),I('Federico','Hay que abolir los privilegios. El portero sabe a quién dejar entrar.'),I('Escobar','La revolución tiene lista de invitados.'),I('Diego León','Toda estrategia necesita un comité de admisiones.')]),
  B('El museo del desacuerdo','La rebeldía convertida en patrimonio cultural.',[
   A('Una curadora propone exhibir el manifiesto bajo vidrio.'),I('Diego León','Era una invitación a destruir el orden.'),I('Escobar','Ahora es una invitación a la inauguración.'),A('Los asistentes aplauden la crítica radical junto al vino de cortesía.')]),
  B('La finca del pueblo','Las contradicciones de clase también organizan el ocio.',[
   I('Federico','Debemos volver a la tierra y comprender al campesinado.'),I('Escobar','¿En qué propiedad empezamos?'),I('Federico','En la finca de mis tíos, mientras averiguamos.'),A('El peón del ajedrez permanece en la misma casilla.')])
 ]},
 oasis:{inicio:[
  A('Cae la noche. Una luz naranja anuncia el bar entre vapor y música.','P-260'),
  A('Un aviso titila: Music Bar, Comida y Dancing.','P-260'),
  A('Al fondo, cuatro hombres ocupan una mesa como si fuera una tertulia perpetua.','P-294'),
  C('Edén','Vea, maestro, le presento: Rubén, Ramón, Narciso. Y yo, que soy Edén. Sin protocolo: aquí todos somos poetas.','P-294'),
  C('Narciso','Lindo nombre.','P-297'),
  A('Los vasos, el humo y las voces forman una pequeña república de poetas.','P-297')
 ],bifurcaciones:[
  B('El premio de los ausentes','El prestigio puede preceder a la lectura.',[
   I('Edén','El concurso ya tiene ganador, aunque falta reunir al jurado.'),I('Escobar','¿Y el libro?'),I('Edén','Eso sería entorpecer la deliberación.'),A('Los poetas levantan sus vasos por la independencia del criterio.')]),
  B('La ciudad distinguida','La bohemia frente al encarecimiento del barrio.',[
   A('El antiguo bar ahora anuncia una carta de degustación.'),I('Narciso','Un café cuesta lo que antes una semana de versos.'),I('Escobar','Por fin la poesía tiene un precio.'),I('Edén','Sí, pero lo cobra el dueño del local.')]),
  B('La academia del elogio','La crítica como intercambio de favores.',[
   I('Edén','Tu obra es decisiva. ¿Has podido leer la mía?'),I('Escobar','La elogiaré en cuanto termine de recomendarla.'),A('La tertulia continúa sin abrir ninguno de los libros.')])
 ]},
 septima:{inicio:[
  A('La lluvia aplasta las hojas de un periódico sobre el asfalto. Los carros avanzan con dificultad.','P-234'),
  A('Ignacio busca un taxi. Pasan automóviles particulares, uno detrás de otro.','P-234'),
  A('La Séptima conserva su prisa. La calle parece narrarse sola.','P-234'),
  A('Ignacio se pregunta de dónde salen tantos ricos con carro mientras no aparece un taxi.','P-234'),
  A('Un bus se detiene. En la acera, un poeta acomoda sus papeles antes de que se mojen.')
 ],bifurcaciones:[
  B('Una calle para todos','La movilidad distribuye el tiempo de forma desigual.',[
   I('Poeta','Todos tenemos derecho a llegar tarde, pero unos llegan en automóvil.'),I('Escobar','La democracia comienza cuando todos nos detenemos en el mismo trancón.'),A('Un peatón busca un cruce que todavía no existe.')]),
  B('La ciudad conmemorativa','¿Quién decide qué recuerda una avenida?',[
   A('Una placa nueva cubre otra más antigua.'),I('Escobar','Qué conveniente: cambiamos la inscripción y conservamos el pedestal.'),I('Poeta','La ciudad tiene una gran memoria para los nombres y una pésima para los hechos.')]),
  B('El arte de no mirar','La calle convierte la indiferencia en hábito.',[
   I('Poeta','El señor se detuvo a mirar el accidente.'),I('Escobar','¿Ayudó?'),I('Poeta','No. Le pareció un espectáculo excelente.'),A('La circulación vuelve a abrirse.')])
 ]},
 parque:{inicio:[
  A('La luz disminuye. Ángela sale a caminar con un perro grande que no quiere obedecer.','P-3715'),
  A('El animal olfatea las esquinas. Ella tira de la correa y la caminata pierde su ritmo.','P-3715'),
  A('Los árboles y las luces de la calle se confunden a medida que oscurece.','P-3715'),
  A('Escobar sigue el paseo sin saber quién guía realmente a quién.')
 ],bifurcaciones:[
  B('La ciudad saludable','La libertad cotidiana regulada como recomendación.',[
   I('Ángela','El municipio ha medido cuánto debemos caminar para ser felices.'),I('Escobar','Entonces el perro es un peligro para la estadística.'),A('El perro vuelve a detenerse, indiferente a cualquier indicador.')]),
  B('Los jardines permitidos','¿De quién es un parque público?',[
   I('Escobar','La verja dice que esta pradera es de todos.'),I('Ángela','Y el guardia dice que no podemos pisarla.'),A('Los dos se quedan mirando el césped perfectamente vacío.')]),
  B('Una conversación interrumpida','El encuentro accidental como forma de resistencia.',[
   A('Dos conocidos se cruzan y se reconocen con una leve sorpresa.'),I('Ángela','Qué raro encontrarnos sin que nadie lo haya organizado.'),I('Escobar','Eso debería prohibirse por impredecible.'),A('La noche cae sobre el camino.')])
 ]},
 porciuncula:{inicio:[
  A('Una campana anuncia la misa. Las escaleras del atrio todavía están húmedas.','P-5506 / P-5507'),
  C('Madre','A de doce, me figuro, a la Porciúncula.','P-5506'),
  A('Escobar cuelga el teléfono y descubre que llegará tarde. Es día de elecciones y no encuentra taxis.','P-5507'),
  A('La ciudad parece haber dispuesto todas sus distancias contra él.','P-5507')
 ],bifurcaciones:[
  B('La urna y el altar','La moral privada confundida con deber público.',[
   I('Monseñor','La conciencia debe hablar libremente. Nosotros solo indicamos la respuesta correcta.'),I('Escobar','Una libertad admirable: se entrega ya resuelta.'),A('En la puerta, los fieles conversan más de las urnas que del sermón.')]),
  B('El orden de las apariencias','La ceremonia como ritual de pertenencia.',[
   I('Madre','Aquí se viene bien presentado, Ignacio.'),I('Escobar','Pensé que importaba el alma.'),I('Madre','El alma no excusa llegar sin chaqueta.'),A('Las campanas interrumpen la discusión.')]),
  B('El perdón administrativo','La burocracia llevada al terreno de la fe.',[
   I('Escobar','¿El perdón se solicita aquí?'),I('Monseñor','Primero el formulario. Luego verá si hay turno.'),A('Un silencio reverente llena el pasillo.')])
 ]},
 jockey:{inicio:[
  A('En el salón todos parecen saber a qué familia pertenece cada invitado.','P-3395'),
  C('Prima adolescente','Ahora en abril papá me quiere hacer un baile blanco en el Jockey.','P-3395'),
  C('Prima adolescente','Que además ya no se usa dar bailes blancos, y menos en el Jockey.','P-3395'),
  A('La queja de la prima no altera el protocolo de la sala.','P-3395')
 ],bifurcaciones:[
  B('El apellido de entrada','Los privilegios convertidos en credenciales.',[
   I('Alicia','En la puerta piden invitación.'),I('Escobar','¿No basta el apellido?'),I('Alicia','Solo si el portero conoce la genealogía.'),A('Una lista manuscrita permanece junto al guardarropa.')]),
  B('La caridad de gala','Beneficencia y exhibición social.',[
   A('Se inaugura una cena destinada a los más necesitados.'),I('Foción','Este año el presupuesto de la gala fue excepcional.'),I('Escobar','¿Y para los necesitados?'),I('Foción','Eso depende de cuánto sobre después del brindis.')]),
  B('La tradición que se moderniza','Todo cambia para conservar la misma jerarquía.',[
   I('Alicia','Ya no se baila como antes.'),I('Escobar','Qué alivio. Pensé que había cambiado también quién podía entrar.'),A('La orquesta comienza un vals que todos reconocen.')])
 ]},
 casa_familiar:{inicio:[
  A('La mesa familiar está servida. La conversación se ha convertido en un recuento de votos.','P-5339 / P-5340'),
  C('Tío Pablo','Hay que votar por López, Ignacito: Foción dice que es el que va a ganar.','P-5339'),
  C('Prima Alicia','Vote por Gómez, Ignacio.','P-5340'),
  A('Los parientes discrepan. Nadie parece sorprendido de que una sobremesa decida el destino del país.','P-5340')
 ],bifurcaciones:[
  B('La democracia de sobremesa','La política entendida como patrimonio de familia.',[
   I('Foción','En esta casa siempre se ha votado con independencia.'),I('Escobar','Naturalmente: cada cual vota por lo que diga el tío.'),A('Los cubiertos se detienen brevemente sobre los platos.')]),
  B('El reparto de favores','El poder convertido en cortesía familiar.',[
   I('Alicia','Dicen que cambiarán el ministro.'),I('Foción','Entonces habrá que felicitar a algún primo.'),I('Escobar','El Estado es nuestra reunión de familia, solo que más cara.')]),
  B('La buena educación','El decoro como forma de callar el conflicto.',[
   I('Madre','De eso no se habla mientras se almuerza.'),I('Escobar','¿De política o de hambre?'),I('Madre','De las dos, Ignacio. Está el servicio delante.'),A('La conversación cambia de tema sin cambiar de clase.')])
 ]},
 unicornio:{inicio:[
  A('Al norte, los lujos del club contrastan con la ciudad que queda atrás.','P-2275'),
  A('Se encienden las luces. Inga se mueve descalza, mientras las conversaciones continúan a su alrededor.'),
  C('Escobar','¿Vinimos a bailar?','P-2277'),
  C('Federico','La cita con los compañeros es aquí.','P-2278'),
  A('Un acuerdo político se prepara entre música, mesas y espectadores.','P-2278')
 ],bifurcaciones:[
  B('La revolución reservada','El poder discute su caída desde una mesa exclusiva.',[
   I('Federico','Necesitamos un movimiento abierto a todos.'),I('Escobar','¿También a quienes no figuran en la lista?'),I('Federico','La apertura tendrá que organizarse por invitación.'),A('Inga continúa bailando mientras nadie mira a la puerta.')]),
  B('La cultura del espectáculo','La protesta se convierte en un número de gala.',[
   A('El presentador anuncia una velada en favor de los olvidados.'),I('Inga','¿Y cuándo entran los olvidados?'),I('Escobar','Supongo que después de los patrocinadores.'),A('Los aplausos tapan el resto de la pregunta.')]),
  B('El consenso de los ausentes','Decisiones que se toman sin sus destinatarios.',[
   I('Federico','Hemos logrado un consenso absoluto.'),I('Escobar','¿Entre quiénes?'),I('Federico','Entre los que fuimos invitados a discutir.'),A('La música cambia; la reunión no.')])
 ]},
 oficina:{inicio:[
  A('Una máquina de escribir permanece sobre un escritorio lleno de papeles. Esta escena es una interpretación, no una cita de la novela.'),
  I('Jefe','¿Está listo el informe, Ignacio?'),
  I('Escobar','He avanzado más en la explicación de por qué no está listo.'),
  A('El reloj avanza. La hoja del informe sigue casi vacía.')
 ],bifurcaciones:[
  B('La comisión de la demora','El procedimiento adquiere vida propia.',[
   I('Jefe','Crearemos una comisión para estudiar por qué falta el informe.'),I('Escobar','Será indispensable otra comisión que estudie a la primera.'),A('El reloj parece aprobar la propuesta.')]),
  B('El mérito invisible','Los indicadores como sustitutos del trabajo.',[
   I('Jefe','El sistema dice que tu desempeño fue excelente.'),I('Escobar','Es que aprendí a informar de lo que todavía no hago.'),A('El jefe firma el reporte satisfecho.')]),
  B('La nueva eficiencia','Automatizar el aplazamiento.',[
   I('Escobar','La máquina ya redactó todas mis excusas.'),I('Jefe','¿Y quién hará el trabajo?'),I('Escobar','Eso está previsto para una etapa posterior.'),A('Se apaga la luz sin que nadie toque el papel.')])
 ]},
 cementerio:{inicio:[
  A('Escobar lee una esquela llena de apellidos, fórmulas y parentescos.','P-6097'),
  A('Encuentra su propio nombre en la lista de quienes invitan a una misa.','P-6099'),
  A('El doctor Foción Urdaneta de Brigard HA MUERTO.','P-6099'),
  A('El anuncio parece prolongar una ceremonia de sociedad incluso después de la muerte.','P-6099')
 ],bifurcaciones:[
  B('La memoria con invitación','Ni el duelo escapa a las jerarquías.',[
   I('Escobar','¿La despedida es pública?'),I('Foción','Desde luego, siempre que el nombre esté en la lista.'),A('Una persona se detiene ante la puerta y vuelve sobre sus pasos.')]),
  B('El monumento sin memoria','El recuerdo convertido en expediente.',[
   I('Escobar','Han aprobado una estatua para recordar al muerto.'),I('Foción','¿Y qué hizo?'),I('Escobar','Eso se decidirá en el concurso del pedestal.'),A('La lluvia cae sobre un nombre apenas legible.')]),
  B('El último protocolo','La muerte no suspende la vida social.',[
   I('Foción','Hay que ordenar a los asistentes según precedencia.'),I('Escobar','Es reconfortante saber que nada cambia.'),A('Se cierra la puerta. Los nombres permanecen.')])
 ]}
};
export const CONTEXTOS:Record<string,string[]>=Object.fromEntries(Object.entries(DIALOGOS).map(([id,s])=>[id,s.bifurcaciones.map(b=>b.contexto)]));
