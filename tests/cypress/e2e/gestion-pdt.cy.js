//Búsquedas de usuarios

function navegarLogin() {
  cy.viewport(1333, 666);
  cy.visit('http://localhost:8080/gestor-pdt/aplicacion/login.jsf');
  cy.wait(2000);
  cy.fixture('datos-login.json').then(datos => {
      cy.log("Usuario: " + datos.username);
      cy.log("Contraseña: " + datos.password);
      const id_usuario = datos.username;
      const password_usuario = datos.password;

      cy.xpath("//input[@id='formLogin:loginUsuario']").type(id_usuario);
      cy.xpath("//input[@id='formLogin:contrasenyaUsuario']").type(password_usuario);
  });

  cy.xpath("//button[@id='formLogin:acceder']/span").click();
  cy.xpath("//div[@id='formLogin:perfilesAsociados']/div[3]/span").click();
  cy.xpath("//li[@id='formLogin:perfilesAsociados_1']").click();
  cy.xpath("//button[@id='formLogin:acceder']/span").click();
  cy.wait(2000);
}

//Nuevo usuario
describe('guardarUsuarios', () => {

  it('guardar usuarios', () => {
      navegarLogin();
      cy.xpath("//div[@id='menuForm:menuPuntoMenu']/ul/li[34]/a").click();
      cy.xpath("//button[@id='formListadoUsuarios:nuevoUsuario']/span[2]").click();
      cy.xpath("//input[@id='formFormularioUsuarios:nombre']").type("Jose");
      cy.xpath("//input[@id='formFormularioUsuarios:primerApellido']").type("Palos");
      cy.xpath("//input[@id='formFormularioUsuarios:segundoApellido']").type("Guiso");
      cy.xpath("//label[@id='formFormularioUsuarios:comboValorIdentificador_label']").click();
      cy.xpath("//li[@id='formFormularioUsuarios:comboValorIdentificador_4']").click();
      cy.xpath("//input[@id='formFormularioUsuarios:identificador']").type("JOSEEX12");
      cy.xpath("//input[@id='formFormularioUsuarios:email']").type("juan.martin@soltel.es");
      cy.xpath("//input[@id='formFormularioUsuarios:telefono_input']").type("602020220");
      cy.xpath("//input[@id='formFormularioUsuarios:login']").type("jose.palos");
      cy.xpath("//button[@id='formFormularioUsuarios:guardar']/span[2]").click();
      
  });
});

//Validaciones de campos

describe('validacionesGuardar', () => {
it('deberia salir true cuando funcione', () => {
  // Configura el estado y los datos necesarios para que todas las validaciones pasen

  cy.wrap(validacionesObligatoriosUsuariosStub).as('validacionesObligatoriosUsuarios');
  cy.wrap(errorIdentificadorNoValidoStub).as('errorIdentificadorNoValido');
  cy.stub(window, 'existeIdentificadorUsuarios').returns(false); //simular cosas
  cy.stub(window, 'existeIdentificadorUsuariosInactivos').returns(false);
  cy.stub(window, 'StringUtils').returns({
    esEmailValido: () => true
  });

  cy.window().then((win) => {
    const validoGuardar = win.validacionesGuardar();

    expect(validoGuardar).to.be.true;
    // Verifica otros resultados esperados
  });
});

it('deberia devolver false si hay error', () => {
  // Configura el estado y los datos necesarios para que algunas validaciones fallen

  cy.wrap(validacionesObligatoriosUsuariosStub).as('validacionesObligatoriosUsuarios');
  cy.wrap(errorIdentificadorNoValidoStub).as('errorIdentificadorNoValido');
  cy.stub(window, 'existeIdentificadorUsuarios').returns(true); //simular cosas
  cy.stub(window, 'existeIdentificadorUsuariosInactivos').returns(false);
  cy.stub(window, 'StringUtils').returns({
    esEmailValido: () => false
  });

  cy.window().then((win) => {
    const validoGuardar = win.validacionesGuardar();

    expect(validoGuardar).to.be.false;
  });
});
});


//Perfiles: Asignación / Desasignación

describe('Asignar Perfil', () => {

it('Asigna un perfil correctamente', () => {
  // Hacer las configuraciones iniciales necesarias (por ejemplo, iniciar sesión)
  
  cy.viewport(1333, 666);
  cy.visit('/');
  cy.wait(2000);    
  cy.get('.acceso-home').first().click();
  
//cargamos archivo de data y procesamos el login

  cy.get('@datosLogin').then(datos => {
  cy.log("USUARIO: "+datos.username);
  cy.log("PASSWORD: "+datos.password);
  const id_usuario=datos.username;
  const password_usuario=datos.password;

  cy.xpath('//input[@id=\'username\']').first().type(id_usuario);
  cy.xpath('//input[@id=\'password\']').first().type(password_usuario);
});
cy.get('.wr-btn').first().click();

  // Simular los datos necesarios para el test
  const perfilSeleccionado = {
    id: 1,
    // Proporciona aquí las demás propiedades del perfil seleccionado necesarias para el test
  };

  // Ejecutar la función asignarPerfil con el perfil seleccionado
  cy.window().then((win) => {
    const { asignarPerfil } = win;
    asignarPerfil(perfilSeleccionado);
  });

  // Verificar que se haya realizado la asignación correctamente
  cy.get('.messages').should('contain', 'Perfil asignado correctamente');

  // Realizar más aserciones y verificaciones necesarias según el resultado esperado
});
});

describe('ocultaPerfilesAsignados', () => {

it('Devuelve true si el idUsuario es nulo', () => {
  // Simular el escenario donde el idUsuario es nulo
  cy.wrap(null).as('idUsuario');

  // Llamar a la función ocultaPerfilesAsignados
  cy.window().then((win) => {
    const { ocultaPerfilesAsignados } = win;
    const result = ocultaPerfilesAsignados();
    
    // Verificar que el resultado sea true
    expect(result).to.be.true;
  });
});

it('Devuelve false si el idUsuario no es nulo', () => {
  // Simular el escenario donde el idUsuario no es nulo
  cy.wrap('123').as('idUsuario');

  // Llamar a la función ocultaPerfilesAsignados
  cy.window().then((win) => {
    const { ocultaPerfilesAsignados } = win;
    const result = ocultaPerfilesAsignados();
    
    // Verificar que el resultado sea false
    expect(result).to.be.false;
  });
});
});

//Detalle usuario

describe('onConsulta1', () => {

it('Realiza la consulta correctamente', () => {
  // Simular el idUsuario necesario para la consulta
  const idUsuario = 123;

  // Configurar el valor del atributo de sesión "NUMERO_SALTOS"
  cy.window().then((win) => {
    const { JsfUtils, Constantes } = win;
    const sessionAttribute = JsfUtils.getSessionAttribute(Constantes.NUMERO_SALTOS);
    JsfUtils.setSessionAttribute(Constantes.NUMERO_SALTOS, sessionAttribute + 1);
  });

  // Llamar a la función onConsulta con el idUsuario
  cy.window().then((win) => {
    const { onConsulta, JsfUtils, Constantes, navegacionBean, ListadoNavegaciones } = win;
    const result = onConsulta(idUsuario);

    // Verificar que se haya configurado correctamente el atributo de sesión "NUMERO_SALTOS"
    const updatedSessionAttribute = JsfUtils.getSessionAttribute(Constantes.NUMERO_SALTOS);
    expect(updatedSessionAttribute).to.eq(sessionAttribute + 1);

    // Verificar que se hayan configurado correctamente los atributos de flash
    const flashEditable = JsfUtils.getFlashAttribute(EDITABLE);
    const flashIdUsuario = JsfUtils.getFlashAttribute("idUsuario");
    expect(flashEditable).to.be.false;
    expect(flashIdUsuario).to.eq(idUsuario);

    // Verificar que se haya configurado correctamente el txtMigaPan
    const expectedTxtMigaPan = Constantes.CONSULTA_USUARIO + usuarioCons.getLogin();
    expect(navegacionBean.getTxtMigaPan()).to.eq(expectedTxtMigaPan);

    // Verificar que se haya devuelto el valor esperado
    const expectedReturnValue = ListadoNavegaciones.FORM_USUARIOS.getRegla();
    expect(result).to.eq(expectedReturnValue);
  });
});
});



//Editar usuario

describe('onConsulta', () => {

it('Realiza la consulta correctamente', () => {
  
cy.get('span').contains('Usuarios').first().click();
cy.get('#formListadoUsuarios:tablaUsuario:1:edicionUsuario').first().click();

it('Prueba de campo vacío', () => {
  cy.get('#formFormularioUsuarios:nombre').clear().should('have.value', '');
  cy.get('#formFormularioUsuarios:guardar').click();
  // Verificar que los cambios se hayan guardado correctamente
});

it('Prueba de edición de un solo campo', () => {
  cy.get('#formFormularioUsuarios:nombre').clear().type('Nuevo nombre');
  cy.get('#formFormularioUsuarios:guardar').click();
  // Verificar que el valor editado se haya guardado correctamente
});

it('Prueba de validación de campos requeridos', () => {
  // Intentar guardar sin ingresar un valor en un campo requerido
  cy.get('#formFormularioUsuarios:guardar').click();
  // Verificar que se muestre un mensaje de error o indicación de campo requerido
});

it('Prueba de validación de campos con formato incorrecto', () => {
  cy.get('formFormularioUsuarios:email').clear().type('correo_invalido');
  cy.get('#formFormularioUsuarios:guardar').click();
  // Verificar que se muestre un mensaje de error o indicación de formato incorrecto
});

it('Prueba de límites de longitud', () => {
  cy.get('#formFormularioUsuarios:nombre').clear().type('Nombre demasiado largo que excede el límite permitido');
  cy.get('#formFormularioUsuarios:guardar').click();
  // Verificar que se muestre un mensaje de error o indicación de longitud excedida
});

it('Prueba de cancelación de edición', () => {
  cy.get('#formFormularioUsuarios:nombre').clear().type('Nuevo nombre');
  cy.get('formFormularioUsuarios:cancelarUsuario').click();
  // Verificar que los valores originales no se vean afectados
});

});
});


//Activar / Desactivar usuario

//ACTIVAR USUARIO

describe('Activar Usuario', () => {
it('debería activar un usuario correctamente', () => {
  // Crear un usuario de prueba
  const usuario = {
    identificador: 'usuario1',
    activa: false
  };

  // Visitar la página o realizar las acciones necesarias para llegar a la funcionalidad de activar usuario

  // Simular la llamada a la función activarUsuario con el usuario de prueba
  cy.window().then((win) => {
    const usuarioService = win.usuarioService;
    cy.stub(usuarioService, 'guardar').resolves();

    // Llamar a la función activarUsuario
    win.activarUsuario(usuario);

    // Verificar que el usuario ha sido activado correctamente
    expect(usuario.activa).to.be.true;

    // Verificar que se ha mostrado el mensaje de éxito
    cy.get('.message-success').should('contain.text', 'Usuario usuario1 actualizado correctamente');
  });
});

it('debería mostrar un mensaje de error en caso de excepción', () => {
  // Crear un usuario de prueba
  const usuario = {
    identificador: 'usuario1',
    activa: false
  };

  // Visitar la página o realizar las acciones necesarias para llegar a la funcionalidad de activar usuario

  // Simular una excepción al llamar a la función activarUsuario
  cy.window().then((win) => {
    const usuarioService = win.usuarioService;
    cy.stub(usuarioService, 'guardar').throws(new Error('Excepción'));

    // Llamar a la función activarUsuario
    win.activarUsuario(usuario);

    // Verificar que el usuario no ha sido activado
    expect(usuario.activa).to.be.false;

    // Verificar que se ha mostrado el mensaje de error
    cy.get('.message-error').should('contain.text', 'Ocurrió un error al activar el usuario');
  });
});
});

//DESACTIVAR USUARIO


describe('Eliminar Usuario', () => {
it('debería desactivar un usuario correctamente', () => {
  // Crear un usuario de prueba
  const usuario = {
    identificador: 'usuario1',
    activa: true
  };

  // Espiar la función guardar del usuarioService para verificar si se llama correctamente
  cy.window().then((win) => {
    const usuarioService = win.usuarioService;
    cy.stub(usuarioService, 'guardar').resolves();

    // Llamar a la función eliminarUsuario con el usuario de prueba
    win.eliminarUsuario(usuario);

    // Verificar que el usuario ha sido desactivado correctamente
    expect(usuario.activa).to.be.false;

    // Verificar que se ha mostrado el mensaje de éxito
    cy.get('.message-success').should('contain.text', 'Usuario usuario1 actualizado correctamente');
  });
});

it('debería mostrar un mensaje de error en caso de excepción', () => {
  // Crear un usuario de prueba
  const usuario = {
    identificador: 'usuario1',
    activa: true
  };

  // Espiar la función guardar del usuarioService para simular una excepción
  cy.window().then((win) => {
    const usuarioService = win.usuarioService;
    cy.stub(usuarioService, 'guardar').throws(new Error('Excepción'));

    // Llamar a la función eliminarUsuario con el usuario de prueba
    win.eliminarUsuario(usuario);

    // Verificar que el usuario no ha sido desactivado
    expect(usuario.activa).to.be.true;

    // Verificar que se ha mostrado el mensaje de error
    cy.get('.message-error').should('contain.text', 'Ocurrió un error al desactivar el usuario');
  });
});
});