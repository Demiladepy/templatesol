import React from 'react'
import { Connection } from '@solana/web3.js'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  activeClusterAtom,
  activeClustersAtom,
  clustersAtom,
  clusterAtom,
  type ClusterProviderContext,
  type SolanaCluster,
  ClusterContext,
  getClusterUrlParam,
} from './cluster-data-access'

export function ClusterProvider({ children }: { children: React.ReactNode }) {
  const cluster = useAtomValue(activeClusterAtom)
  const clusters = useAtomValue(activeClustersAtom)
  const setCluster = useSetAtom(clusterAtom)
  const setClusters = useSetAtom(clustersAtom)

  const value: ClusterProviderContext = {
    cluster,
    clusters: clusters.sort((a, b) => (a.name > b.name ? 1 : -1)),
    addCluster: (cluster: SolanaCluster) => {
      try {
        new Connection(cluster.endpoint)
        setClusters([...clusters, cluster])
      } catch (err) {
        console.error(`${err}`)
      }
    },
    deleteCluster: (cluster: SolanaCluster) => {
      setClusters(clusters.filter((item) => item.name !== cluster.name))
    },
    setCluster: (cluster: SolanaCluster) => setCluster(cluster),
    getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  }

  return <ClusterContext.Provider value={value}>{children}</ClusterContext.Provider>
}
