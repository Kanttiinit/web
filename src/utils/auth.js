export default {
  facebook: {
    init(setAccessToken) {
      FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          setAccessToken(response.authResponse.accessToken)
        } else {
          setAccessToken()
        }
      })
    },
    login: () => new Promise((resolve, reject) => {
      FB.login(response => {
        if (response.authResponse) {
          resolve({provider: 'facebook', token: response.authResponse.accessToken})
        } else {
          reject()
        }
      });
    }),
    logout: () => new Promise(resolve => FB.logout(resolve))
  },
  google: {
    init(setToken) {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '402535393048-osrrh9uci8031oh4sv3vepgifsol0rd8.apps.googleusercontent.com',
          scope: 'profile'
        })
        this.auth2.isSignedIn.listen(isLoggedIn => {
          if (isLoggedIn) {
            setToken(this.auth2.currentUser.get().getAuthResponse().id_token)
          } else {
            setToken()
          }
        })
      })
    },
    login() {
      this.auth2.signIn()
    },
    logout() {
      this.auth2.signOut()
    }
  }
}
