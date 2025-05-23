import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const News2: React.FC = () => (
    <Box minH="100vh" bg="pastelBlue.50" py={10}>
        <Box maxW="container.md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
            <Heading mb={4}>Cómo preparar a tu gato para la llegada de un bebé</Heading>
            <Text mb={4}>
                La llegada de un bebé es un momento emocionante, pero también puede ser un desafío para tu gato. Los felinos son animales de rutina y los cambios pueden generarles estrés. Preparar a tu gato con antelación es esencial para asegurar una convivencia armoniosa.
            </Text>
            <Heading size="lg" mb={2}>1. Introduce cambios gradualmente</Heading>
            <Text mb={4}>
                Los gatos son sensibles a los cambios en su entorno. Comienza a introducir nuevos muebles, como la cuna o el cambiador, con tiempo suficiente para que tu gato se acostumbre a ellos. Permítele explorar estos objetos a su propio ritmo, asegurándote de que no se sienta forzado.
            </Text>
            <Heading size="lg" mb={2}>2. Familiariza a tu gato con los sonidos y olores del bebé</Heading>
            <Text mb={4}>
                Los ruidos y olores nuevos pueden ser desconcertantes para tu gato. Reproduce grabaciones de sonidos de bebés, como llantos o risas, a un volumen bajo y aumenta gradualmente. Además, introduce olores relacionados con el bebé, como lociones o pañales, para que tu gato se acostumbre antes de la llegada del bebé.
            </Text>
            <Heading size="lg" mb={2}>3. Establece un espacio seguro para tu gato</Heading>
            <Text mb={4}>
                Asegúrate de que tu gato tenga un lugar tranquilo y apartado donde pueda retirarse cuando necesite descanso. Este espacio debe estar equipado con su cama, comida, agua y caja de arena. Mantén este refugio accesible en todo momento, especialmente durante las primeras semanas tras la llegada del bebé.
            </Text>
            <Heading size="lg" mb={2}>4. Mantén su rutina diaria</Heading>
            <Text mb={4}>
                Los gatos se benefician de la rutina. Intenta mantener los horarios de alimentación, juego y descanso de tu gato lo más consistentes posible. Esto le proporcionará seguridad y reducirá el estrés asociado con los cambios en el hogar.
            </Text>
            <Heading size="lg" mb={2}>5. Supervisión durante las primeras interacciones</Heading>
            <Text mb={4}>
                La primera vez que tu gato se acerque al bebé, asegúrate de supervisar la interacción. Permite que tu gato se acerque al bebé a su propio ritmo y nunca lo fuerces. Si muestra signos de curiosidad, permite que explore, pero si se muestra reacio o temeroso, dale espacio y tiempo.
            </Text>
            <Heading size="lg" mb={2}>6. Enseña a tu bebé a interactuar con el gato</Heading>
            <Text mb={4}>
                A medida que tu bebé crezca, es importante enseñarle cómo interactuar con el gato de manera respetuosa. Enséñale a acariciar suavemente y a no molestar al gato cuando esté comiendo o descansando. La educación temprana fomentará una relación positiva entre ambos.
            </Text>
            <Heading size="lg" mb={2}>Conclusión</Heading>
            <Text>
                Preparar a tu gato para la llegada de un bebé requiere tiempo, paciencia y planificación. Siguiendo estos pasos, puedes ayudar a tu felino a adaptarse a los cambios y asegurar una convivencia armoniosa en tu hogar. Recuerda siempre consultar con tu veterinario si tienes dudas o preocupaciones sobre el bienestar de tu gato durante este período de transición.
            </Text>
        </Box>
    </Box>
);
export default News2;