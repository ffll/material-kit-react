import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = (role) => {
  // Configuración de navegación para el rol de "admin"
  if (role === 'admin') {
    return [
      {
        title: 'dashboard',
        path: '/',
        icon: icon('ic_analytics'),
      },
      {
        title: 'usuarios',
        path: '/user',
        icon: icon('ic_user'),
      },
      {
        title: 'Contenidos',
        path: '/contenidos',
        icon: icon('ic_blog'),
      }
    ];
  }

  // Configuración de navegación para el rol de "user"
  if (role === 'user') {
    return [
      {
        title: 'Contenidos',
        path: '/contenidos',
        icon: icon('ic_blog'),
      },
    ];
  }

  // Retorna un array vacío si el rol no coincide (opcional)
  return [];
};

export default navConfig;


