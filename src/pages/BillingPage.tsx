import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/ToastProvider'
import { 
  CreditCard, 
  CheckCircle2, 
  Calendar,
  Download,
  ArrowUpRight,
  Zap,
  Crown,
  Building2
} from 'lucide-react'

export function BillingPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Mock billing data
  const currentPlan = {
    name: 'Pro',
    price: 29,
    period: 'month',
    status: 'active',
    nextBillingDate: '2026-07-09',
  }

  const usage = {
    documents: {
      used: 12,
      limit: 50,
    },
    envelopes: {
      used: 28,
      limit: 100,
    },
    storage: {
      used: 2.4,
      limit: 10,
    },
  }

  const billingHistory = [
    {
      id: 'inv-003',
      date: '2026-06-09',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - June 2026',
    },
    {
      id: 'inv-002',
      date: '2026-05-09',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - May 2026',
    },
    {
      id: 'inv-001',
      date: '2026-04-09',
      amount: 29,
      status: 'paid',
      description: 'Pro Plan - April 2026',
    },
  ]

  const paymentMethod = {
    type: 'visa',
    last4: '4242',
    expiry: '12/2027',
  }

  const plans = [
    {
      name: 'Free',
      price: 0,
      icon: Zap,
      features: ['5 documents/month', '2 signers/doc', 'Email support'],
    },
    {
      name: 'Pro',
      price: 29,
      icon: Crown,
      features: ['50 documents/month', '10 signers/doc', 'Priority support', 'API access'],
      current: true,
    },
    {
      name: 'Business',
      price: 99,
      icon: Building2,
      features: ['Unlimited documents', 'Unlimited signers', '24/7 support', 'API access', 'Custom branding'],
    },
  ]

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-danger'
    if (percentage >= 70) return 'bg-warning'
    return 'bg-primary'
  }

  return (
    <AppShell title="Billing">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  {currentPlan.status}
                </Badge>
              </div>
              <p className="text-3xl font-bold">
                ${currentPlan.price}
                <span className="text-lg font-normal text-muted-foreground">/{currentPlan.period}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/pricing')}>
                Change Plan
              </Button>
              <Button variant="ghost">
                Cancel Subscription
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Next billing date:</span>
              <span className="font-semibold">
                {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="mb-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold">{usage.documents.used}</span>
                <span className="text-sm text-muted-foreground">of {usage.documents.limit}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getUsageColor(
                    getUsagePercentage(usage.documents.used, usage.documents.limit)
                  )}`}
                  style={{
                    width: `${getUsagePercentage(usage.documents.used, usage.documents.limit)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {usage.documents.limit - usage.documents.used} documents remaining
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Envelopes</h3>
            <div className="mb-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold">{usage.envelopes.used}</span>
                <span className="text-sm text-muted-foreground">of {usage.envelopes.limit}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getUsageColor(
                    getUsagePercentage(usage.envelopes.used, usage.envelopes.limit)
                  )}`}
                  style={{
                    width: `${getUsagePercentage(usage.envelopes.used, usage.envelopes.limit)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {usage.envelopes.limit - usage.envelopes.used} envelopes remaining
            </p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Storage</h3>
            <div className="mb-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-bold">{usage.storage.used} GB</span>
                <span className="text-sm text-muted-foreground">of {usage.storage.limit} GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getUsageColor(
                    getUsagePercentage(usage.storage.used, usage.storage.limit)
                  )}`}
                  style={{
                    width: `${getUsagePercentage(usage.storage.used, usage.storage.limit)}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {(usage.storage.limit - usage.storage.used).toFixed(1)} GB remaining
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Method */}
          <Card>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Method
            </h2>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Visa ending in {paymentMethod.last4}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires {paymentMethod.expiry}
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Update
              </Button>
            </div>
          </Card>

          {/* Upgrade Plans */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
            <div className="space-y-3">
              {plans.map((plan) => {
                const Icon = plan.icon
                return (
                  <div
                    key={plan.name}
                    className={`p-4 rounded-lg border ${
                      plan.current ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{plan.name}</span>
                        {plan.current && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Current
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold">
                        ${plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, i) => (
                        <span key={i} className="text-xs text-muted-foreground">
                          {feature}{i < plan.features.length - 1 ? ' •' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Billing History</h2>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">${invoice.amount}</p>
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
