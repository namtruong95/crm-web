import { KeycloakService } from 'keycloak-angular';
import { environment } from 'environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.kc_url,
            realm: environment.kc_realm,
            clientId: environment.kc_client_id,
            credentials: {
              secret: environment.kc_secret,
            },
          },
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: true,
          },
          enableBearerInterceptor: true,
          bearerExcludedUrls: ['/assets', '/clients/public'],
          bearerPrefix: 'Bearer',
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
