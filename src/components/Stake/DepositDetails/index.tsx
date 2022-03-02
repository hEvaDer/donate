import { Flex, Heading, Text } from '@chakra-ui/layout'
import { prizePool, ticketTokenAddress } from '../../../utils/poolTogether'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'
import { StakeMode } from '..'

interface Props {
  stakingMode: StakeMode
  cta: string
  withdrawCta: string
  stakedValueLabel: string
  totalStakedLabel: string
}

const multiSigAddress = '0x10E1439455BD2624878b243819E31CfEE9eb721C'

export const DepositDetails = ({
  stakingMode,
  cta,
  withdrawCta,
  stakedValueLabel,
  totalStakedLabel
}: Props) => {
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(ticketTokenAddress, account)
  const tokenBalanceOrZero = tokenBalance || 0
  const [totalYieldEarned, setTotalYieldEarned] = useState(0)

  useEffect(() => {
    const getPrizePool = async () => {
      if (prizePool) {
        const secondsSinceEpoch = Math.round(Date.now() / 1000)

        const ticketContract = await prizePool.getTicketContract()
        const amount = await ticketContract.getBalanceAt(
          multiSigAddress,
          secondsSinceEpoch
        )
        const convertedAmount =
          utils.formatUnits(BigNumber.from(amount), 6)?.toString() || 0
        // @ts-ignore
        setTotalYieldEarned(convertedAmount)
      }
    }

    getPrizePool()
  }, [])

  return (
    <Flex
      flexDirection="column"
      align="space-around"
      justify="center"
      gap={16}
      width="100%"
      maxWidth={720}
    >
      <Heading textAlign="center">
        {stakingMode === StakeMode.STAKE ? cta : withdrawCta}
      </Heading>

      <Flex
        direction={['column', 'column', 'row', 'row']}
        justify="space-around"
        align="center"
        gap={4}
      >
        <Flex
          direction="column"
          align="center"
          padding={8}
          borderRadius="25px"
          background="rgba(0, 0, 0, 0.2)"
          minWidth={240}
        >
          <Heading color="white" fontSize="50px">
            $
            {utils
              .formatUnits(BigNumber.from(tokenBalanceOrZero), 6)
              ?.toString() || 0}
          </Heading>
          <Text color="white" fontSize="20px">
            {stakedValueLabel}
          </Text>
        </Flex>

        <Flex
          direction="column"
          align="center"
          padding={8}
          borderRadius="25px"
          background="rgba(0, 0, 0, 0.2)"
          minWidth={240}
        >
          <Heading color="white" fontSize="50px">
            ${totalYieldEarned}
          </Heading>
          <Text color="white" fontSize="20px">
            {totalStakedLabel}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
