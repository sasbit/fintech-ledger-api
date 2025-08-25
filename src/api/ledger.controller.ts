import { Controller, Post, Get, Param, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LedgerService, CreatePostingDto, PostingResultDto } from '@application/services/ledger.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Ledger Operations')
@ApiBearerAuth()
@Controller('api/v1/ledger')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('postings')
  @ApiOperation({ summary: 'Create a new posting', description: 'Creates a new double-entry posting with balanced debits and credits' })
  @ApiResponse({ status: 201, description: 'Posting created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error or unbalanced entries' })
  async createPosting(@Body() createPostingDto: CreatePostingDto) {
    try {
      const posting = await this.ledgerService.createPosting(createPostingDto);
      return {
        success: true,
        data: posting
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to create posting',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('entries')
  async getAllEntries() {
    try {
      const postings = await this.ledgerService.getAllPostings();
      const allEntries = postings.flatMap(posting => 
        posting.entries.map(entry => ({
          id: entry.id,
          accountId: entry.accountId,
          type: entry.type,
          amount: entry.amount.toString(),
          description: entry.description,
          reference: posting.reference,
          timestamp: entry.timestamp.toISOString(),
        }))
      );
      
      return {
        success: true,
        data: allEntries
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve entries',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('entries/:reference')
  async getEntriesByReference(@Param('reference') reference: string) {
    try {
      const posting = await this.ledgerService.getPostingByReference(reference);
      const entries = posting.entries.map(entry => ({
        id: entry.id,
        accountId: entry.accountId,
        type: entry.type,
        amount: entry.amount.toString(),
        description: entry.description,
        reference: posting.reference,
        timestamp: entry.timestamp.toISOString(),
      }));
      
      return {
        success: true,
        data: {
          reference: posting.reference,
          description: posting.description,
          entries: entries
        }
      };
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Posting not found',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Get('postings')
  async getAllPostings() {
    try {
      const postings = await this.ledgerService.getAllPostings();
      return {
        success: true,
        data: postings.map(posting => ({
          id: posting.id,
          reference: posting.reference,
          description: posting.description,
          totalAmount: posting.getTotalAmount().toString(),
          entryCount: posting.entries.length,
          hash: posting.hash,
          createdAt: posting.createdAt.toISOString(),
        }))
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve postings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
