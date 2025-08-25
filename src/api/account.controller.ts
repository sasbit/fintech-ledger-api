import { Controller, Post, Get, Param, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AccountService, CreateAccountDto, AccountBalanceDto } from '@application/services/account.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Account Management')
@ApiBearerAuth()
@Controller('api/v1/accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account', description: 'Creates a new account with specified type and initial balance' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or account already exists' })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    try {
      const account = await this.accountService.createAccount(createAccountDto);
      return {
        success: true,
        data: {
          id: account.id,
          name: account.name,
          type: account.type,
          balance: account.balance.toString(),
        }
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to create account',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance', description: 'Retrieves the current balance for a specific account' })
  @ApiParam({ name: 'id', description: 'Account ID', example: 'sample_cash_account' })
  @ApiResponse({ status: 200, description: 'Account balance retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getAccountBalance(@Param('id') id: string) {
    try {
      const balance = await this.accountService.getAccountBalance(id);
      return {
        success: true,
        data: balance
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Account not found',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get(':id/entries')
  @ApiOperation({ summary: 'Get account entries', description: 'Retrieves all ledger entries for a specific account' })
  @ApiParam({ name: 'id', description: 'Account ID', example: 'sample_cash_account' })
  @ApiResponse({ status: 200, description: 'Account entries retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getAccountEntries(@Param('id') id: string) {
    try {
      const entries = await this.accountService.getAccountEntries(id);
      return {
        success: true,
        data: entries.map(entry => ({
          id: entry.id,
          type: entry.type,
          amount: entry.amount.toString(),
          description: entry.description,
          reference: entry.reference,
          timestamp: entry.timestamp.toISOString(),
        }))
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Account not found',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts', description: 'Retrieves a list of all accounts in the system' })
  @ApiResponse({ status: 200, description: 'Accounts retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllAccounts() {
    try {
      const accounts = await this.accountService.getAllAccounts();
      return {
        success: true,
        data: accounts.map(account => ({
          id: account.id,
          name: account.name,
          type: account.type,
          balance: account.balance.toString(),
        }))
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve accounts',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
