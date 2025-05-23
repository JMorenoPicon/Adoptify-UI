import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import CustomList from '@/components/ui/list';

const News1: React.FC = () => (
    <Box minH="100vh" bg="pastelBlue.50" py={10}>
        <Box maxW="container.md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
            <Heading mb={4}>Consejos para cuidar a tu perro en verano</Heading>
            <Text mb={4}>
                El verano puede ser una época difícil para los perros debido al calor. Asegúrate de que tu mascota tenga siempre agua fresca, evita paseos en las horas de más calor y nunca dejes a tu perro en el coche. Además, protégelo de parásitos y cuida sus patas del asfalto caliente.
            </Text>
            <Heading size="lg" mb={2}>1. Hidratación constante</Heading>
            <Text mb={4}>
                La hidratación es esencial para prevenir problemas como la deshidratación y el golpe de calor. Se recomienda ofrecer agua fresca y limpia a tu perro en todo momento, especialmente después de paseos o actividades físicas. Según expertos veterinarios, la cantidad adecuada de agua diaria para perros y gatos es de aproximadamente 50 ml por kilo de peso. Es importante monitorear su consumo y estar atento a cualquier cambio en sus hábitos de bebida.
            </Text>
            <Heading size="lg" mb={2}>2. Evitar las horas de mayor calor</Heading>
            <Text mb={4}>
                Durante el verano, las temperaturas alcanzan su punto máximo entre las 11:00 y las 16:00 horas. Es aconsejable evitar pasear a tu perro durante este período. Opta por salir temprano en la mañana o al atardecer, cuando el sol es menos intenso y las superficies están más frescas. Esto no solo protege sus patas, sino que también reduce el riesgo de golpes de calor.
            </Text>
            <Heading size="lg" mb={2}>3. Protección de las patas</Heading>
            <Text mb={4}>
                El asfalto caliente puede alcanzar temperaturas peligrosas para las patas de los perros, causando quemaduras graves. Para prevenir esto:
            </Text>
            <CustomList
                items={[
                    <><strong>Realiza la prueba de los 5 segundos:</strong> coloca el dorso de tu mano en el asfalto; si no puedes mantenerla allí por más de cinco segundos debido al calor, es demasiado caliente para tu perro.</>,
                    <><strong>Evita superficies calientes:</strong> opta por caminar sobre césped, tierra o zonas sombreadas.</>,
                    <><strong>Considera el uso de botines para perros:</strong> estos protegen las almohadillas del calor extremo.</>
                ]}
            />
            <Heading size="lg" mb={2}>4. Protección solar</Heading>
            <Text mb={4}>
                Al igual que los humanos, los perros también pueden sufrir quemaduras solares, especialmente aquellos con pelajes claros o zonas sin pelo. Aplica protector solar específico para mascotas en áreas expuestas como la nariz, orejas y abdomen. Consulta con tu veterinario para elegir el producto adecuado.
            </Text>
            <Heading size="lg" mb={2}>5. Actividad física moderada</Heading>
            <Text mb={4}>
                Durante los días calurosos, es esencial moderar la actividad física de tu perro. Evita juegos intensos y opta por sesiones de ejercicio más cortas y suaves. Considera actividades acuáticas, como juegos con agua, para mantenerlo activo sin sobrecalentarlo.
            </Text>
            <Heading size="lg" mb={2}>6. Precauciones adicionales</Heading>
            <CustomList
                items={[
                    <><strong>Nunca dejes a tu perro en el coche:</strong> incluso con las ventanas abiertas, la temperatura dentro de un vehículo puede aumentar rápidamente, poniendo en riesgo la vida de tu mascota.</>,
                    <><strong>Proporciona un refugio fresco:</strong> asegúrate de que tu perro tenga acceso a un lugar sombreado y ventilado donde pueda descansar cómodamente.</>,
                    <><strong>Monitorea signos de golpe de calor:</strong> jadeo excesivo, letargo, encías rojas o pálidas, y vómitos son indicativos de un golpe de calor. Si observas estos síntomas, busca atención veterinaria inmediata.</>
                ]}
            />
            <Heading size="lg" mb={2}>Conclusión</Heading>
            <Text>
                Cuidar a tu perro durante el verano requiere atención y precaución. Implementando estas estrategias, puedes asegurar que tu mascota disfrute de la temporada de forma segura y saludable. Recuerda siempre consultar con tu veterinario ante cualquier duda o síntoma inusual.
            </Text>
        </Box>
    </Box>
);

export default News1;
