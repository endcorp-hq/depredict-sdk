'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, TrendingUp, Check, Info, Clock, DollarSign, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useShortx } from '@/components/solana/useDepredict'
import { CreateMarketArgs, OracleType, MarketType } from '@/types/market-types'
import { PublicKey } from '@solana/web3.js'
import { useSolana } from '@/components/solana/use-solana'

const createMarketSchema = z.object({
  question: z.string().min(1, 'Question is required').max(280, 'Question too long'),
  marketType: z.nativeEnum(MarketType),
  oracleType: z.nativeEnum(OracleType),
  startTime: z.date({
    error: (issue) => {
      if (issue.input === undefined) return 'Start time is required'
      if (issue.code === 'invalid_type') return 'Must be a valid date'
      return 'Invalid date'
    },
  }),
  endTime: z.date({
    error: (issue) => {
      if (issue.input === undefined) return 'End time is required'
      if (issue.code === 'invalid_type') return 'Must be a valid date'
      return 'Invalid date'
    },
  }),
  bettingStartTime: z.date().optional(),
  metadataUri: z.string().min(1, 'Metadata URI is required').url('Must be a valid URL'),
  oraclePubkey: z.string().optional(),
  mintAddress: z.string().optional(),
})

type CreateMarketFormData = z.infer<typeof createMarketSchema>

export function CreateMarketForm() {
  const shortx = useShortx()
  const { account } = useSolana()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Fix hydration error - only render dates on client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<CreateMarketFormData>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      question: '',
      marketType: MarketType.FUTURE,
      oracleType: OracleType.MANUAL,
      startTime: new Date(),
      endTime: new Date(),
      bettingStartTime: undefined,
      metadataUri: '',
      oraclePubkey: '',
      mintAddress: '',
    },
  })

  const payer = account?.address || new PublicKey('11111111111111111111111111111111')
  const feeVaultAccount = new PublicKey(process.env.NEXT_PUBLIC_FEE_VAULT || '11111111111111111111111111111111')

  const onSubmit = async (data: CreateMarketFormData) => {
    if (!shortx.isInitialized || !shortx.client) {
      setSubmitError('SDK not initialized')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const args: CreateMarketArgs = {
        startTime: Math.floor(data.startTime.getTime() / 1000),
        endTime: Math.floor(data.endTime.getTime() / 1000),
        bettingStartTime: data.bettingStartTime ? Math.floor(data.bettingStartTime.getTime() / 1000) : undefined,
        question: data.question,
        metadataUri: data.metadataUri,
        payer,
        feeVaultAccount,
        oracleType: data.oracleType,
        marketType: data.marketType,
        ...(data.oracleType === OracleType.SWITCHBOARD &&
          data.oraclePubkey && { oraclePubkey: new PublicKey(data.oraclePubkey) }),
        ...(data.mintAddress && { mintAddress: new PublicKey(data.mintAddress) }),
      }

      const result = await shortx.createMarket(args)
      if (result) {
        setSubmitSuccess(true)
        form.reset()
        shortx.refresh()
      } else {
        throw new Error('Failed to create market')
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create market')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOraclePubkeyRequired = form.watch('oracleType') === OracleType.SWITCHBOARD

  // Format date safely to avoid hydration mismatch
  const formatDate = (date: Date | undefined) => {
    if (!date || !mounted) return 'Pick a date'
    return format(date, 'PPP')
  }

  return (
    <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header Section - Matching MarketsSection style */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 mb-4">
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create New Market</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Set up a prediction market and let users trade on future outcomes
        </p>
      </div>

      {/* Main Form Card - Matching MarketsSection styling */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Info className="w-4 h-4 text-purple-400" />
              Market Question
              <span className="text-purple-400">*</span>
            </Label>
            <Textarea
              id="question"
              placeholder="Will Bitcoin reach $100,000 by end of 2025?"
              {...form.register('question')}
              className="min-h-[100px] resize-none bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {form.formState.errors.question && (
              <p className="text-sm text-red-400">{form.formState.errors.question.message}</p>
            )}
            <p className="text-xs text-slate-500">Ask a clear yes/no question about a future event</p>
          </div>

          {/* Two Column Layout - Market Type & Oracle Type */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Market Type */}
            <div className="space-y-2">
              <Label htmlFor="marketType" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Market Type
                <span className="text-purple-400">*</span>
              </Label>
              <Select
                onValueChange={(value) => form.setValue('marketType', value as MarketType)}
                value={form.watch('marketType')}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 hover:border-purple-500/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20">
                  <SelectValue placeholder="Select market type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value={MarketType.LIVE} className="text-white hover:bg-slate-700">
                    Live
                  </SelectItem>
                  <SelectItem value={MarketType.FUTURE} className="text-white hover:bg-slate-700">
                    Future
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Choose when betting starts</p>
            </div>

            {/* Oracle Type */}
            <div className="space-y-2">
              <Label htmlFor="oracleType" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Info className="w-4 h-4 text-purple-400" />
                Oracle Type
                <span className="text-purple-400">*</span>
              </Label>
              <Select
                onValueChange={(value) => form.setValue('oracleType', value as OracleType)}
                value={form.watch('oracleType')}
              >
                <SelectTrigger className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 hover:border-purple-500/50 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20">
                  <SelectValue placeholder="Select oracle type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value={OracleType.MANUAL} className="text-white hover:bg-slate-700">
                    Manual
                  </SelectItem>
                  <SelectItem value={OracleType.SWITCHBOARD} className="text-white hover:bg-slate-700">
                    Switchboard
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">How the market will be resolved</p>
            </div>
          </div>

          {/* Conditional Oracle Pubkey */}
          {isOraclePubkeyRequired && (
            <div className="space-y-2">
              <Label htmlFor="oraclePubkey" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Info className="w-4 h-4 text-purple-400" />
                Oracle Public Key
                <span className="text-purple-400">*</span>
              </Label>
              <Input
                id="oraclePubkey"
                placeholder="Enter Switchboard oracle public key"
                {...form.register('oraclePubkey')}
                className="bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              {form.formState.errors.oraclePubkey && (
                <p className="text-sm text-red-400">{form.formState.errors.oraclePubkey.message}</p>
              )}
            </div>
          )}

          {/* Two Column Layout - Start Time & End Time */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                Start Time
                <span className="text-purple-400">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 hover:border-purple-500/50 text-white',
                      !form.watch('startTime') && 'text-slate-500',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                    <span suppressHydrationWarning>{formatDate(form.watch('startTime'))}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={form.watch('startTime')}
                    onSelect={(date) => date && form.setValue('startTime', date)}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-400">{form.formState.errors.startTime.message}</p>
              )}
              <p className="text-xs text-slate-500">When should betting begin?</p>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock className="w-4 h-4 text-purple-400" />
                End Time
                <span className="text-purple-400">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 hover:border-purple-500/50 text-white',
                      !form.watch('endTime') && 'text-slate-500',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                    <span suppressHydrationWarning>{formatDate(form.watch('endTime'))}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={form.watch('endTime')}
                    onSelect={(date) => date && form.setValue('endTime', date)}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-400">{form.formState.errors.endTime.message}</p>
              )}
              <p className="text-xs text-slate-500">Market resolution deadline</p>
            </div>
          </div>

          {/* Betting Start Time (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="bettingStartTime" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              Betting Start Time (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700/50 hover:bg-slate-900 hover:border-purple-500/50 text-white',
                    !form.watch('bettingStartTime') && 'text-slate-500',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                  <span suppressHydrationWarning>{formatDate(form.watch('bettingStartTime'))}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar
                  mode="single"
                  selected={form.watch('bettingStartTime')}
                  onSelect={(date) => form.setValue('bettingStartTime', date)}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-slate-500">Custom betting start time if different from market start</p>
          </div>

          {/* Metadata URI */}
          <div className="space-y-2">
            <Label htmlFor="metadataUri" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Info className="w-4 h-4 text-purple-400" />
              Metadata URI
              <span className="text-purple-400">*</span>
            </Label>
            <Input
              id="metadataUri"
              placeholder="https://example.com/metadata.json"
              type="url"
              {...form.register('metadataUri')}
              className="bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {form.formState.errors.metadataUri && (
              <p className="text-sm text-red-400">{form.formState.errors.metadataUri.message}</p>
            )}
            <p className="text-xs text-slate-500">Link to market metadata JSON</p>
          </div>

          {/* Optional Mint Address */}
          <div className="space-y-2">
            <Label htmlFor="mintAddress" className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign className="w-4 h-4 text-purple-400" />
              Mint Address (Optional)
            </Label>
            <Input
              id="mintAddress"
              placeholder="Enter mint public key (optional)"
              {...form.register('mintAddress')}
              className="bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <p className="text-xs text-slate-500">Custom token mint for the market</p>
          </div>

          {/* Payer & Fee Vault Display */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-purple-300 block mb-1">Payer Account</Label>
                <div className="text-sm font-mono text-slate-300 truncate">{payer.toString()}</div>
              </div>
              <div>
                <Label className="text-xs text-purple-300 block mb-1">Fee Vault</Label>
                <div className="text-sm font-mono text-slate-300 truncate">{feeVaultAccount.toBase58()}</div>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Submit Button - Matching MarketsSection gradient style */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !shortx.isInitialized}
              className={cn(
                'w-full py-6 text-base font-semibold rounded-xl transition-all duration-300',
                !isSubmitting && shortx.isInitialized
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-slate-700/50 text-slate-500 cursor-not-allowed',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Market...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Launch Market
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mt-6 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
              <Check className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-purple-300 mb-2">Market Created Successfully!</h3>
            <p className="text-slate-400">Your new market is now live and ready for trading.</p>
          </div>
        )}
      </div>

      {/* Tips Section - Matching MarketsSection style */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          {
            icon: Info,
            title: 'Clear Questions',
            description: 'Make your question objective and verifiable with clear resolution criteria',
          },
          {
            icon: Clock,
            title: 'Reasonable Timeline',
            description: 'Set resolution dates that allow proper verification of outcomes',
          },
          {
            icon: TrendingUp,
            title: 'Market Activity',
            description: 'Higher engagement leads to better price discovery and liquidity',
          },
        ].map((tip, index) => (
          <div key={index} className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/50 mb-3">
              <tip.icon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">{tip.title}</h3>
            <p className="text-xs text-slate-500">{tip.description}</p>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 text-center text-sm text-slate-500">
        Markets are created on Devnet. Switch to Mainnet in production.
      </div>
    </section>
  )
}
