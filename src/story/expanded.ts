/** La novela se conserva como fuente etiquetada P-; los diálogos añadidos son escenas originales
 *  propuestas para este prototipo, NO citas de Antonio Caballero. */
import {DIALOGOS as BASE,type Linea, type EscenaTexto} from './dialogues';
const I=(voz:string,texto:string):Linea=>({voz,texto,interpretativa:true});
const setup:Record<string,Linea[]>={
 apartamento:[I('Fina','La luz lleva horas entrando por la ventana. ¿Vas a levantarte hoy, Ignacio?'),I('Escobar','Estoy decidiendo cómo empezar el poema.'),I('Fina','Eso dijiste ayer. La máquina de escribir sigue tapada de papeles.')],
 taller:[I('Diego León','No pises el cuadro. Es el único que no he vendido.'),I('Escobar','¿Y la partida de ajedrez?'),I('Federico','La dejamos a medias porque surgió otra discusión sobre la revolución.')],
 oasis:[I('Edén','Siéntese, maestro. La mesa ya está discutiendo quién inventó la poesía.'),I('Escobar','Parece un oficio con demasiados aspirantes.'),I('Narciso','Todavía no hemos pedido la primera ronda.')],
 unicornio:[I('Inga','Las luces se encienden, la orquesta ensaya. Nadie escucha lo que sucede detrás.'),I('Escobar','Pensé que veníamos a bailar.'),I('Federico','Vinimos por algo más que la música.')],
 jockey:[I('Foción','La sala tiene memoria, Ignacio. Aquí las familias se reconocen antes de presentarse.'),I('Escobar','Y también se reconocen las cuentas pendientes.'),I('Alicia','Esta noche todo el mundo hablará de la misma fiesta.')],
 porciuncula:[I('Madre','Ya suenan las campanas. No podemos llegar después de todos.'),I('Escobar','Hay demasiada prisa para algo que llaman recogimiento.'),I('Monseñor','Pasen, por favor. Dejen la conversación para el atrio.')],
 parque:[I('Ángela','No tires de la correa. El perro quiere detenerse.'),I('Escobar','Por una vez, alguien en Bogotá tiene tiempo.'),I('Ángela','Mira los árboles. Parece que va a llover.')],
 casa_familiar:[I('Madre','Siéntate, Ignacio. El almuerzo se enfría mientras los tíos discuten de política.'),I('Foción','Las decisiones importantes se toman entre familia.'),I('Escobar','En esta mesa se heredan hasta las opiniones.')],
 oficina:[I('Jefe','Aquí está el informe que te pedí. ¿Cuándo podré leerlo?'),I('Escobar','Pronto. Tengo el título y dos páginas.'),I('Jefe','El informe no es un poema, Ignacio.')],
 cementerio:[I('Escobar','Hasta el silencio parece ocupar un lugar en las listas de invitados.'),I('Foción','Las noticias llegan tarde cuando se trata de los muertos.'),I('Escobar','Y demasiado pronto cuando se trata de los vivos.')],
 septima:[I('Poeta','La calle está llena de voces y nadie parece oír las otras.'),I('Escobar','Los carros hacen tanto ruido como las conversaciones.'),I('Poeta','Un periódico mojado también sabe contar la ciudad.')]
};
const outro:Record<string,Linea[]>={
 apartamento:[I('Fina','Afuera la ciudad sigue moviéndose. Aquí llevamos una hora en la misma frase.'),I('Escobar','Quizá el poema sea precisamente eso: el tiempo que nos roba.')],
 taller:[I('Diego León','Mueves un peón y hablas de cambiar el mundo.'),I('Escobar','Al menos el peón sabe hacia dónde avanza.')],
 oasis:[I('Edén','Las palabras circulan mejor que el dinero, pero pagan menos.'),I('Escobar','Entonces pidamos la cuenta antes del próximo manifiesto.')],
 unicornio:[I('Inga','Desde aquí la música tapa las conversaciones de las mesas.'),I('Escobar','Es una manera elegante de no escuchar nada.')],
 jockey:[I('Foción','En estas salas todo tiene su puesto.'),I('Escobar','Incluso quienes fingen que no les importa.')],
 porciuncula:[I('Escobar','El sonido de las campanas se mezcla con los buses de la calle.'),I('Madre','Vamos. Siempre encuentras cómo llegar tarde.')],
 parque:[I('Ángela','A veces un paseo se vuelve una conversación distinta.'),I('Escobar','O la misma conversación con otro paisaje.')],
 casa_familiar:[I('Alicia','¿Vamos a seguir discutiendo hasta el café?'),I('Escobar','Por lo menos el café todavía puede cambiar de temperatura.')],
 oficina:[I('Escobar','La máquina suena mejor cuando nadie pregunta por los resultados.'),I('Jefe','No es una respuesta a mi pregunta.')],
 cementerio:[I('Escobar','Las fechas quedan grabadas. Lo demás se lo lleva la lluvia.'),I('Foción','Y la memoria cambia según quién cuente la historia.')],
 septima:[I('Escobar','Mira cómo la lluvia borra las letras de la calle.'),I('Poeta','Y mañana alguien escribirá lo mismo encima.')]
};
export const CONTEXTOS:Record<string,[string,string,string]>={
 apartamento:['La escritura se vuelve una competencia visible en pantallas.','Los sentimientos adquieren el vocabulario de la productividad.','La vida cotidiana desaparece detrás de las noticias.'],
 taller:['La discusión deja de tratar sobre el cuadro.','La revolución se transmite con patrocinadores.','La vuelta a la tierra también tiene privilegios.'],
 oasis:['La poesía empieza a depender de sus métricas.','Una mesa decide quién merece ser escuchado.','El barrio cambia de clientes y de precios.'],
 unicornio:['El acceso al salón exige otra clase de credenciales.','El espectáculo adopta el discurso político.','La pista se transforma en una vitrina social.'],
 jockey:['El baile se organiza para una audiencia digital.','Un apellido se convierte en identificación.','La tradición se vende como una novedad.'],
 porciuncula:['La ceremonia se convierte en contenido.','Las decisiones públicas ingresan en la conversación religiosa.','Una pantalla interrumpe el silencio de la nave.'],
 parque:['Un encuentro depende de una notificación.','El paseo se convierte en una estadística.','Los mapas predicen incluso los desvíos.'],
 casa_familiar:['Los familiares trasladan la discusión a un chat.','Las preferencias políticas parecen heredarse.','El apellido se presenta como una marca.'],
 oficina:['La oficina se traslada a una videollamada.','El informe se convierte en un indicador.','La máquina propone una excusa automática.'],
 cementerio:['El obituario circula como publicación viral.','La memoria tiene planes de suscripción.','La muerte sigue siendo un acontecimiento social.'],
 septima:['La movilidad incorpora nuevos trabajadores invisibles.','La calle se convierte en un escenario permanente.','Un desconocido interrumpe el recorrido.']
};
const branchEpilogue:Record<string,[Linea[],Linea[],Linea[]]>={
 apartamento:[ [I('Escobar','Hay diez poemas nuevos en la pantalla y ninguno mío.'),I('Fina','Podrías cerrar la pantalla y decirme lo que piensas.')], [I('Escobar','Nombrar la culpa parece más fácil que cambiar algo.'),I('Fina','Entonces empieza por lavar los platos.')], [I('Fina','Llevas horas siguiendo las vidas de otros.'),I('Escobar','Tal vez las noticias se escriben solas para no dejarnos escribir.')]],
 taller:[[I('Diego León','El tablero no sabe de privilegios: cada pieza tiene un movimiento.'),I('Escobar','Y sin embargo la reina tiene todas las ventajas.')],[I('Federico','Hasta la rabia tiene un anuncio antes de empezar.'),I('Escobar','La revolución ahora paga el alquiler con clics.')],[I('Diego León','La tierra de la que hablan tiene portero.'),I('Escobar','Todo parece más radical a la sombra de una finca.')]],
 oasis:[[I('Narciso','¿Y si alguien leyera los versos sin mirar los números?'),I('Edén','Eso se llama nostalgia de los viejos tiempos.')],[I('Edén','La discusión ya ha expulsado a media mesa.'),I('Escobar','Quedamos los suficientes para no estar de acuerdo.')],[I('Narciso','Ahora el bar tiene carta de autor.'),I('Escobar','Y a los poetas no les alcanza para un café.')]],
 unicornio:[[I('Inga','Los de la puerta deciden quién participa del espectáculo.'),I('Escobar','Y los de dentro deciden quién merece mirarlo.')],[I('Federico','Se puede protestar sin abandonar la mesa reservada.'),I('Escobar','Una contradicción con servicio de botella.')],[I('Inga','La pista se vacía cuando se apagan las luces.'),I('Escobar','Entonces por fin se oyen las voces.')]],
 jockey:[[I('Alicia','Nadie recuerda quién quería venir.'),I('Escobar','Pero todos recuerdan cómo salió en las fotos.')],[I('Foción','La tradición necesita nombres que la sostengan.'),I('Escobar','Y bastante papel membretado.')],[I('Alicia','La etiqueta es nueva. La conversación no cambió.'),I('Escobar','Como la misma sala con otra iluminación.')]],
 porciuncula:[[I('Madre','Ahora hasta la misa cabe en una pantalla.'),I('Escobar','El cielo necesita buena conexión.')],[I('Monseñor','La conversación se ha desviado del sermón.'),I('Escobar','Las calles rara vez siguen un solo recorrido.')],[I('Madre','¿No puedes guardar ese aparato un momento?'),I('Escobar','Parece que el silencio exige más esfuerzo que antes.')]],
 parque:[[I('Ángela','En las pantallas todo parece una cita inevitable.'),I('Escobar','En los parques, hasta encontrarse es casual.')],[I('Ángela','Nos pidieron caminar veinte minutos exactos.'),I('Escobar','Y el perro no sabe contar.')],[I('Ángela','El teléfono propone regresar por el mismo sitio.'),I('Escobar','A veces conviene perderse, aunque sea en un mapa.')]],
 casa_familiar:[[I('Foción','El debate continúa en el teléfono después del almuerzo.'),I('Escobar','Al menos aquí podemos dejar de escuchar.')],[I('Alicia','Hasta la rebeldía tiene apellido.'),I('Escobar','Es el problema de crecer en una mesa con tantos retratos.')],[I('Madre','Primero terminemos el café.'),I('Escobar','Quizá todavía podamos hablar de algo que no cotice.')]],
 oficina:[[I('Jefe','Veo tu nombre en pantalla, pero no te oigo.'),I('Escobar','La ausencia ahora tiene una luz verde.')],[I('Jefe','La tabla dice que faltan resultados.'),I('Escobar','Hay resultados que no se dejan poner en columnas.')],[I('Jefe','La máquina escribió una disculpa impecable.'),I('Escobar','Entonces el aplazamiento por fin es eficiente.')]],
 cementerio:[[I('Foción','Miles de personas han visto la esquela.'),I('Escobar','¿Y cuántas conocían al muerto?')],[I('Escobar','Una suscripción puede durar más que una biografía.'),I('Foción','El recuerdo no debería tener fecha de caducidad.')],[I('Foción','Hasta en la despedida importa saber quién llegó.'),I('Escobar','La última fiesta de una sociedad de apariencias.')]],
 septima:[[I('Poeta','La calle parece más rápida pero nadie llega antes.'),I('Escobar','Solo cambiaron los uniformes de quienes corren.')],[I('Poeta','La miseria también necesita una audiencia.'),I('Escobar','La calle conserva su papel de escenario.')],[I('Poeta','¿Viste cómo el hombre volvió sobre sus pasos?'),I('Escobar','Un desvío puede cambiar todo el relato.')]]
};
export const DIALOGOS:Record<string,EscenaTexto>=Object.fromEntries(Object.entries(BASE).map(([id,story])=>{
 if(id==='cerros')return [id,story];
 const beginnings=setup[id]??[],ends=outro[id]??[],labels=CONTEXTOS[id]??['Una bifurcación en la escena.','Otra mirada sobre lo ocurrido.','Una salida inesperada.'];
 return [id,{
  inicio:[...beginnings,...story.inicio.filter(line=>line.voz!=='Narrador'),...ends],
  bifurcaciones:story.bifurcaciones.map((b,i)=>({
    titulo:b.titulo,
    contexto:labels[i],
    lineas:[I('Escobar',labels[i]),...b.lineas,...((branchEpilogue[id]??[])[i]??[])]
  }))
 }];
}));
