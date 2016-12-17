export default {
  '@tags': ['sign-up'],
  'Commenter Sign Up': client => {
    const embedStream = client.page.embedStream();
    const { baseUrl, testUser } = client.globals;


    // loginPage
    //   .navigate(baseUrl + '/login')
    //   .ready()
    //
    // loginPage.login(testUser)
    // client.pause(2000);
  }
}
