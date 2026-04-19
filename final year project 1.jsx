import React, { useMemo, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Platform, Text, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'

function buildBaseCandidates() {
  const localhost = Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1'
  // Common LAN addresses to try; add your machine IP if different
  const lanCandidates = ['192.168.1.100', '10.76.100.76']
  const ports = [5173, 5174, 5175]
  const bases = []
  ports.forEach((p) => bases.push(`http://${localhost}:${p}`))
  lanCandidates.forEach((host) => ports.forEach((p) => bases.push(`http://${host}:${p}`)))
  return bases
}

export default function MapWebView() {
  const urls = useMemo(() => buildBaseCandidates().map((base) => `${base}/map`), [])
  const [urlIndex, setUrlIndex] = useState(0)
  const [loadError, setLoadError] = useState('')
  const url = urls[urlIndex]

  const tryNextUrl = () => {
    if (urlIndex < urls.length - 1) {
      setLoadError('')
      setUrlIndex((current) => current + 1)
      return
    }
    setLoadError(
      'Unable to reach the railway map. Start the Vite frontend and make sure the local address is reachable from the emulator/device.'
    )
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" color="#38bdf8" style={styles.loader} />}
        onError={tryNextUrl}
        onHttpError={tryNextUrl}
      />
      {!!loadError && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Map connection error</Text>
          <Text style={styles.errorText}>{loadError}</Text>
          <Text style={styles.errorHint}>Tried URL: {url}</Text>
          <TouchableOpacity style={styles.button} onPress={() => { setLoadError(''); setUrlIndex(0) }}>
            <Text style={styles.buttonLabel}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071126' },
  loader: { flex: 1 },
  errorCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(8, 17, 31, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.55)',
  },
  errorTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  errorText: { color: '#cbd5e1', fontSize: 13, lineHeight: 19 },
  errorHint: { color: '#fca5a5', fontSize: 12, marginTop: 8, marginBottom: 12 },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#0f766e',
  },
  buttonLabel: { color: '#ecfeff', fontWeight: '700' },
})
