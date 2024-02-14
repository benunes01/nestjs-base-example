import { sign } from "jsonwebtoken";
import AppError from "../../../errors/AppError";
import { IAuthToken, AuthTokenOptions } from "../interfaces/AuthToken";

export default class AuthTokenProvider {
  private static readonly PRIVATE_KEY: string = process.env.PRIVATE_KEY
    ? process.env.PRIVATE_KEY.replace(/\\n/gm, "\n")
    : '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDf9Cikh+moNfmq\nzWawGL7/7w+EmskyvtIbHpESoi3mubEONVMds/VMMsyvK96V+gSMYSKM/AxyWjq9\nJT3dV1Lw2KIcsuwArYM89lg65EMHmwon2Qm8aLqTvXyzJ5MRrtEH9nxJBTX8FZq3\nmQnsBVu/PTOgMVQfQLay/QKC48Q7fl5BuZAh/9/tyUJOsCXfeLqodY4EKOg48pMb\n8iPqT6gTO1LeVwOLL8WNXkAvVSLr6oRTGyufiRck9rVaUA3NlLPcalfcvTorVjDO\nXOPxAk1AOnAa++jfNpdhqAIFuyQsRru69RaH+vRj/YYgugDsazhn5LVshSbdc/V+\nnfydtTu9AgMBAAECggEANqN9x/h93gN/LHgM+eErtkrntRFDja0nGyU3vT1SqBQ9\nWYtSgjBt5B+Ptxwjo+EZ+3rWYGG9EqgnZQ7BO2+K5YZg9NIFSLwMhRLQH1wh62jc\nzzCBUtWVUaa9FgONeta1GnV9SJ5sF5rYwrrkhBAhnHSM1CQ80xwpht06H998eIvs\n/Qp1W0REKl2wqsMBHPuRmLDqfGOH8c1vPJ0qgAR+GVWHd0JdJ3guxdlyb1kC+GRk\n04NCeCDm2N+JmhXk5+Ck4HbuRN4Xv8carQWxEWhSEVHK+TPjGPHzYvxubz+RTIN1\n834RW7o749a5+tZ1xQyD7arn7ahnaNZZ/Q3WVAS3EQKBgQD4tR338c3LoSnEu43Q\n+QNDUlU+VlXU4ryib0jrBRONlJIzR1gVpwWApgfh5I+Z2jd/EzJ7OsdhAHwxEPhP\nTVKM9mIA+gM0N7PYK2Y8+1ODqgVQpsMgK06w770L+GGVFnow1y0meq2HWsENnAdM\nwMVgxag85lUjcqLNxKjYLWlNjQKBgQDmhTtPulzMDXqY4sfnpqpCpyLuH+ST9TUc\nZy8UD0yVry7lf4jnQeoqjKgsu+ul38B9dLYG/EzyB8Pf2qLtQpSF8dbvOSWdGW0H\n+fKzOOv2AJnp9UdcaaWusERBILHel+DUJ97V4bQkHCOY0rIHlRgXaN9QjmlpLHui\n8lqxRICi8QKBgHsPw2BoOVhEypIZ67Y3QLITDzLlLVtFRelp/z6rKF2p4h2Vc7Rj\nDIn3nXbczWFnZIZwTU5Ea1tIDiuJJhS3Qd2WHDA3hVZVKZwQ/Wm3Qj+n5TFfErXc\nN/e86GH/6OkIUjXQgvrDQRH0ignd5o7H4+Jaa0CXCBGeK4h9gr5U2gIRAoGBAM/W\nL7Oigyg2vuI5FaN2UOvnZUbs2lnMKyaAoaGkaZhLaizg374hX88dIkOy6rOTGSoD\noFqL/5P4DFI3/c2Myfw6H19wVslds0ANyxRrrdMOl7aovr5DQm5N3jwaDkRzCvI9\nQFv2M0SbWjzfOkQ72IzCsRUgUUnSIWa4u6w35wMBAoGAaY+kpNff7cbDCfHndvm/\nyad6eGItl99kWzChZW7uUIvHGpegOdiyA+zBFNR4KVnVChzPxmHNgarhydNrtgP+\nOOYMoj7PyYwbNJ8tLPOtH/dtQKZHJf8xJxBRU1E+Q+kxQgojc12AaVmujaauTVHg\nNrdAu3E6Op1Ix/4Nvg625W8=\n-----END PRIVATE KEY-----'.replace(/\\n/gm, "\n");

  private static readonly TOKEN_EXPIRATION_TIME: string = "600m";

  private static getTokenOptions(subject: string): AuthTokenOptions {
    return {
      expiresIn: AuthTokenProvider.TOKEN_EXPIRATION_TIME,
      subject,
    };
  }

  signToken(userId: string): IAuthToken {
    if (!AuthTokenProvider.PRIVATE_KEY) {
      throw new AppError("Failed to load PRIVATE_KEY environment variable.", 500);
    }

    const tokenOptions = AuthTokenProvider.getTokenOptions(userId);
    const jwt = sign({ userId }, AuthTokenProvider.PRIVATE_KEY, {
      algorithm: "RS256",
      ...tokenOptions,
    });

    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + parseInt(tokenOptions.expiresIn));

    return { jwt, expiresIn };
  }
}
