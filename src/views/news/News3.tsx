import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const News3: React.FC = () => (
  <Box minH="100vh" bg="pastelBlue.50" py={10}>
    <Box maxW="container.md" mx="auto" mt={10} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading mb={4}>Beneficios de adoptar una mascota en lugar de comprarla</Heading>
      <Text mb={4}>
        Adoptar una mascota es una decisión que va más allá de ofrecer un hogar; es un acto de responsabilidad y empatía que tiene un impacto positivo tanto en el animal como en su nuevo dueño. A continuación, exploramos las principales ventajas de optar por la adopción en lugar de la compra.
      </Text>
      <Heading size="lg" mb={2}>1. Salvas una vida</Heading>
      <Text mb={4}>
        Al adoptar, brindas una segunda oportunidad a un animal que ha sido abandonado o maltratado. Muchos refugios están saturados, y cada adopción libera espacio para otro animal necesitado. Según la Fundación Affinity, en 2023 se registraron más de 286.000 abandonos de animales en España
      </Text>
      <Heading size="lg" mb={2}>2. Combates la sobrepoblación animal</Heading>
      <Text mb={4}>
        La sobrepoblación de animales es un problema crítico. Adoptar ayuda a reducir la demanda de cría irresponsable y contribuye a disminuir el número de animales sin hogar. Al elegir adoptar, participas activamente en la solución de este problema.
      </Text>
      <Heading size="lg" mb={2}>3. Evitas apoyar la cría irresponsable</Heading>
      <Text mb={4}>
        Muchos criaderos comerciales operan en condiciones cuestionables, priorizando el beneficio económico sobre el bienestar animal. Al adoptar, no contribuyes a estas prácticas y apoyas a organizaciones que trabajan por el bienestar de los animales.
      </Text>
      <Heading size="lg" mb={2}>4. Ahorro económico</Heading>
      <Text mb={4}>
        Adoptar suele ser más económico que comprar. Las tarifas de adopción generalmente incluyen esterilización, vacunas y microchip, lo que representa un ahorro significativo en comparación con los costos asociados a la compra de una mascota
      </Text>
      <Heading size="lg" mb={2}>5. Variedad de opciones</Heading>
      <Text mb={4}>
        En los refugios, puedes encontrar una amplia variedad de animales de diferentes edades, tamaños y temperamentos. Esto te permite elegir una mascota que se adapte a tu estilo de vida y necesidades.
      </Text>
      <Heading size="lg" mb={2}>6. Fomentas una cultura de empatía y responsabilidad</Heading>
      <Text mb={4}>
        Adoptar enseña valores como la empatía, el respeto y la responsabilidad. Al compartir tu experiencia, inspiras a otros a considerar la adopción, contribuyendo a una sociedad más consciente y compasiva.
      </Text>
      <Heading size="lg" mb={2}>Conclusión</Heading>
      <Text>
        Optar por la adopción es una decisión ética y responsable que beneficia tanto al animal como al adoptante. Al elegir adoptar, no solo estás ofreciendo un hogar, sino también contribuyendo a una causa mayor. Recuerda que cada vez que eliges adoptar, salvas una vida y haces del mundo un lugar mejor para los animales.
      </Text>
    </Box>
  </Box>
);
export default News3;