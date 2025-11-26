import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RunCodeDto } from '../dto/run-code.dto';

@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name);
  private readonly judge0BaseUrl: string;
  private readonly judge0ApiKey?: string;
  private readonly judge0ApiHost?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.judge0BaseUrl =
      this.configService.get<string>('JUDGE0_BASE_URL') ??
      'https://ce.judge0.com';

    this.judge0ApiKey = this.configService.get<string>('JUDGE0_API_KEY');
    this.judge0ApiHost = this.configService.get<string>('JUDGE0_API_HOST');
  }

  async runCode(runCodeDto: RunCodeDto) {
    const url = `${this.judge0BaseUrl}/submissions?base64_encoded=false&wait=true`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.judge0ApiKey) {
      headers['X-RapidAPI-Key'] = this.judge0ApiKey;
    }

    if (this.judge0ApiHost) {
      headers['X-RapidAPI-Host'] = this.judge0ApiHost;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            language_id: runCodeDto.languageId,
            source_code: runCodeDto.sourceCode,
            stdin: runCodeDto.stdin ?? '',
          },
          { headers },
        ),
      );

      const { stdout, stderr, compile_output, status, time, memory } =
        response.data;

      return {
        stdout,
        stderr,
        compile_output,
        status,
        time,
        memory,
      };
    } catch (error) {
      this.logger.error('Judge0 execution failed', error);
      const responseMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        'Unable to execute code at this time.';
      throw new InternalServerErrorException(responseMessage);
    }
  }
}


