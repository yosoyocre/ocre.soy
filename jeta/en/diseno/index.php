<!doctype html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./css/output.css" rel="stylesheet">

    <script src="https://use.typekit.net/wfj3ppv.js"></script>

    <script src="./js/p5.min.js"></script>
    <script src="./js/poisson-disk-sampling.min.js"></script>
    <script type="module" src="./js/jeta.js"></script>
    <script type="module">
        import {
            jeta
        } from "./js/jeta.js";

        try {
            const enviaPeticion = () => {
                const input = document.querySelector('.js-pregunta input');
                const valor = input.value.trim();
                if (valor.length > 0) {
                    const pregunta = document.querySelector('.js-pregunta');

                    pregunta.classList.add('hidden');
                    document.querySelector('.js-cargando').classList.remove('hidden');
                    setTimeout(() => {
                        document.querySelector('.js-cargando').classList.remove('opacity-0');
                        setTimeout(() => {
                            // Hacemos una petición a la inteligencia artificial con el problema
                            fetch('peticion.php', {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                    },
                                    body: new URLSearchParams({
                                        problema: valor
                                    }),
                                }).then(response => response.json())
                                .then(data => {
                                    console.log(data);
                                    document.querySelector('.js-cargando').classList.add('hidden');
                                    document.querySelector('.js-respuesta').classList.remove('hidden');
                                    new p5(jeta(data.solucion));
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    document.querySelector('.js-cargando').classList.add('hidden');
                                    document.querySelector('.js-error').classList.remove('hidden');
                                    setTimeout(() => {
                                        document.querySelector('.js-error').classList.remove('opacity-0');
                                    }, 100);
                                });
                        }, 3000);
                    }, 100);

                }
            }

            Typekit.load({
                active: function() {

                    const input = document.querySelector('.js-pregunta input');
                    input.addEventListener('keydown', function(event) {
                        if (event.key === 'Enter') {
                            enviaPeticion();
                        }
                    });

                    const boton = document.querySelector('.js-boton');
                    boton.addEventListener('click', enviaPeticion);

                    const pregunta = document.querySelector('.js-pregunta');
                    pregunta.classList.remove('opacity-0');
                },
            });
        } catch (e) {}
    </script>
</head>

<body class="bg-white text-slate-800">
    <div class="absolute top-0 left-0 p-4 text-4xl">
        <a href="/jeta/en/diseno">
            Sloke.ai
        </a>
    </div>

    <div class="tarjeta opacity-0 js-pregunta flex pt-72 justify-center min-h-screen text-3xl">
        <div class="max-w-2xl w-full text-center">
            <div class="px-4">
                <p>
                    Sloke.ai te ayuda a resolver tus problemas laborales con <b>inteligencia artificial</b>
                </p>
                <div class="w-full rounded-full pl-6 pr-3 pt-1 pb-4 border border-slate-300 mt-8 shadow-lg text-left">
                    <input type="text" placeholder="¿Qué es lo que te preocupa hoy en tu trabajo?" maxlength="60" class="w-[calc(100%-3rem)] mt-[9px] text-xl focus:outline-none">
                    <button class="js-boton float-right mt-1 w-10 h-10 flex items-center justify-center bg-slate-800 rounded-full hover:bg-slate-500 cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path class="fill-white" d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    </div>
    <div class="tarjeta js-cargando hidden opacity-0 flex pt-72 justify-center min-h-screen text-3xl">
        <div class="max-w-2xl w-full text-center">
            <div class="px-4">
                <p class="animate-pulse">
                    Sloke.ai está pensando una solución para ti...
                </p>
            </div>
        </div>
    </div>
    <div class="tarjeta js-error hidden opacity-0 flex pt-72 justify-center min-h-screen text-3xl">
        <div class="max-w-2xl w-full text-center">
            <div class="px-4">
                <p class="mb-8">
                    Ha ocurrido un error y Sloke.ai no ha podido encontrar una solución para ti
                </p>
                <p>
                    Por favor, inténtalo de nuevo más tarde
                </p>
            </div>
        </div>
    </div>
    <div class="tarjeta js-respuesta hidden flex items-center justify-center  min-h-screen">
        <main class="js-portada w-[500px] h-[500px]"></main>
    </div>
</body>

</html>