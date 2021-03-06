const { deploy, remove } = require('./index')
const protocols = require('./protocols/index')
const AWS = require('aws-sdk')

jest.mock('./protocols/index', () => ({
  getProtocol: jest.fn((value) => ({
    deploy: jest.fn(() => ({
      subscriptionArn: 'subscriptionArn',
      statement: 'statement'
    })),
    remove: jest.fn(),
    types: [value]
  }))
}))

jest.mock('aws-sdk', () => {
  const mocks = {
    setSubscriptionAttributesMock: jest.fn()
  }

  const SNS = {
    setSubscriptionAttributes: (obj) => ({
      promise: () => mocks.setSubscriptionAttributesMock(obj)
    })
  }

  return {
    mocks,
    SNS: jest.fn().mockImplementation(() => SNS)
  }
})

afterEach(() => {
  protocols.getProtocol.mockClear()
  AWS.mocks.setSubscriptionAttributesMock.mockClear()
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('SNS Subscription Unit Tests', () => {
  it('should deploy subscription', async () => {
    const inputs = {
      topic: 'topic-arn',
      protocol: 'lambda',
      endpoint: 'lambda-arn',
      subscriptionAttributes: {
        filterPolicy: {
          event_type: ['order_placed', 'order_cancelled']
        },
        deliveryPolicy: {
          healthyRetryPolicy: {
            minDelayTarget: 20,
            maxDelayTarget: 20,
            numRetries: 3,
            numMaxDelayRetries: 0,
            numNoDelayRetries: 0,
            numMinDelayRetries: 0,
            backoffFunction: 'linear'
          },
          throttlePolicy: {}
        },
        rawMessageDelivery: true
      }
    }
    const contextMock = {
      log: () => {},
      saveState: jest.fn(),
      state: {}
    }
    const outputs = await deploy(inputs, contextMock)
    expect(protocols.getProtocol).toHaveBeenCalledTimes(1)
    expect(contextMock.saveState).toHaveBeenCalledTimes(1)
    expect(outputs.arn).toEqual('subscriptionArn')
  })

  it('should not deploy subscription', async () => {
    const inputs = { topic: 'topic-arn', protocol: 'lambda', endpoint: 'lambda-arn' }
    const contextMock = {
      log: () => {},
      saveState: jest.fn(),
      state: {
        topic: 'topic-arn',
        protocol: 'lambda',
        endpoint: 'lambda-arn',
        subscriptionArn: 'subscriptionArn'
      }
    }
    const outputs = await deploy(inputs, contextMock)
    expect(protocols.getProtocol).toHaveBeenCalledTimes(0)
    expect(contextMock.saveState).toHaveBeenCalledTimes(1)
    expect(outputs.arn).toEqual('subscriptionArn')
  })

  it('should remove subscription attribute', async () => {
    const inputs = {
      topic: 'topic-arn',
      protocol: 'lambda',
      endpoint: 'lambda-arn',
      subscriptionAttributes: {
        filterPolicy: {
          event_type: ['order_placed', 'order_cancelled']
        },
        rawMessageDelivery: true
      }
    }

    const contextMock = {
      log: () => {},
      saveState: jest.fn(),
      state: {
        topic: 'topic-arn',
        protocol: 'lambda',
        endpoint: 'lambda-arn',
        subscriptionArn: 'subscriptionArn',
        subscriptionAttributes: {
          filterPolicy: {
            event_type: ['order_placed', 'order_cancelled']
          },
          deliveryPolicy: {
            healthyRetryPolicy: {
              minDelayTarget: 20,
              maxDelayTarget: 20,
              numRetries: 3,
              numMaxDelayRetries: 0,
              numNoDelayRetries: 0,
              numMinDelayRetries: 0,
              backoffFunction: 'linear'
            },
            throttlePolicy: {}
          },
          rawMessageDelivery: true
        }
      }
    }
    const outputs = await deploy(inputs, contextMock)
    expect(protocols.getProtocol).toHaveBeenCalledTimes(0)
    expect(contextMock.saveState).toHaveBeenCalledTimes(1)
    expect(outputs.arn).toEqual('subscriptionArn')
  })

  it('should remove subscription when protocol changes and then deploy new', async () => {
    const inputs = { topic: 'topic-arn', protocol: 'http', endpoint: 'http://serverless.com' }
    const contextMock = {
      log: () => {},
      saveState: jest.fn(),
      state: {
        topic: 'topic-arn',
        protocol: 'lambda',
        endpoint: 'lambda-arn',
        subscriptionArn: 'subscriptionArn'
      }
    }
    const outputs = await deploy(inputs, contextMock)
    expect(protocols.getProtocol).toHaveBeenCalledTimes(2)
    expect(contextMock.saveState).toHaveBeenCalledTimes(2)
    expect(outputs.arn).toEqual('subscriptionArn')
  })

  it('should remove subscription', async () => {
    const inputs = { topic: 'topic-arn', protocol: 'lambda', endpoint: 'lambda-arn' }
    const contextMock = {
      log: () => {},
      saveState: jest.fn(),
      state: {
        topic: 'topic-arn',
        protocol: 'lambda',
        endpoint: 'lambda-arn',
        subscriptionArn: 'subscriptionArn'
      }
    }
    const outputs = await remove(inputs, contextMock)
    expect(protocols.getProtocol).toHaveBeenCalledTimes(1)
    expect(contextMock.saveState).toHaveBeenCalledTimes(1)
    expect(outputs).toEqual({})
  })
})
