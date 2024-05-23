import { ConfigService } from '@nestjs/config';
import { AUTH_CONSTANTS } from '../entities/constant/auth.constants';

export class UrlJointUtil {
  constructor(private configService: ConfigService) {}

  /**
   * return target url
   * @param host
   * @param port
   * @constructor
   */
  static UserUrlJoint(host: string, port: string) {
    return (
      AUTH_CONSTANTS.PROTOCOL +
      host +
      AUTH_CONSTANTS.COLON +
      port +
      AUTH_CONSTANTS.SLASH +
      AUTH_CONSTANTS.RESOURCE_PATH_USER +
      AUTH_CONSTANTS.SLASH
    );
  }
}
