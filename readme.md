## Proyecto API para LISABOT

### Motivo:
Ante la necesidad de requerir cada vez más sofisticados mecanismos para el uso de LisaBot, y observando el potencial que tiene el uso de la API de OpenAI, tomé la decisión de crear una propia API para su uso, una claramente personalizada que incluya todas aquellas características embebidas en el código fuente de LisaBot, un código muy poco mantenible y sobre todo anticuado.

### plantilla:
LisaBot deberá ser flexible no solo para permitir una conversación consigo misma, sino también para permitir otras denominaciones y configuraciones dinámicas que tengan como propósito evitar la configuración y mantener un sistema eficiente de memoria.

la clase Chatbot inicialmente deberá permitir obtener un prompt, el cual no obtendrá más que una declaración hecha por x usuario, el resto de parámetros deberán ser proporciados por el cliente desde la propia API, es decir, chatbot.controller.js a priori no se encargará de configurar contextos, nombres,memoria o algo similar.

Nuestro controlador chatbot tendrá el deber de configurar adecuadamente el prompt que se pasará a el método "talk" de la clase Chatbot, por lo que tendrá que manejar adecuadamente el contexto y los nombres, además de porsupuesto encargarse de la memoria

### Notas:
Sam para que no te sientas un imbecil, recuerda que debes pensar como tu propio cliente que consumirá la api, dime, el context es estático?, la respuesta es no, los nombres variarán constantemente el context puede que muy poco. La idea es permitir flexibilidad, por esa misma razón es que no es descabellado enviar un context con nombres variables a modificar {botName} y {userName}. ahm... bueno acabamos de hacer posible que se puedan insertar cualquier cantidad de parámetros jijija