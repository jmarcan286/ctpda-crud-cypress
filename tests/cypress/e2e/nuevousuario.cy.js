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

    it('iniciar sesion', () => {
        navegarLogin();
    });

    it('entrar apartado creacion de usuarios', () => {
        cy.xpath("//div[@id='menuForm:menuPuntoMenu']/ul/li[34]/a").click();
        cy.xpath("//button[@id='formListadoUsuarios:nuevoUsuario']/span[2]").click();
    });

    it('creacion usuario', () => {
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