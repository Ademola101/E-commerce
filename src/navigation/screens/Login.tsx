import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../../../config/theme'
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Login = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top + theme.spacing.md }}>
      <Text>Login</Text>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({})