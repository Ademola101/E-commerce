import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import React from 'react'
import { theme } from '../../../config/theme'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from '../../components/Text';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../hooks/useAuth';


const Login = () => {
  const insets = useSafeAreaInsets();
  const { loginAsAdmin, loginAsUser } = useAuthStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.xxlg }]}>
      <Animated.View 
        entering={FadeInUp.delay(200).springify()}
        style={styles.header}
      >
        <Text 
          variant="h3" 
          text="Welcome to Pandar E-commerce"
          color={theme.colors.textPrimary}
          align="center"
        />
        <Text 
          variant="body1" 
          text="Choose how you want to continue" 
          color={theme.colors.textSecondary}
          align="center"
          spacing="xxlg"
        />
      </Animated.View>

      <View style={styles.cardsContainer}>
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <TouchableOpacity 
            style={[styles.card, styles.adminCard]}
            activeOpacity={0.8}
            onPress={loginAsAdmin}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="shield-checkmark" size={40} color={theme.colors.primary} />
            </View>
            <Text 
              variant="h4Bold" 
              text="Login as Admin" 
              color={theme.colors.textPrimary}
              spacing="s"
            />
            <Text 
              variant="body2" 
              text="Manage products, orders and users" 
              color={theme.colors.textSecondary}
              align="center"
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <TouchableOpacity 
            style={[styles.card, styles.userCard]}
            activeOpacity={0.8}
            onPress={loginAsUser}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="person" size={40} color={theme.colors.primary} />
            </View>
            <Text 
              variant="h4Bold" 
              text="Login as User" 
              color={theme.colors.textPrimary}
              spacing="s"
            />
            <Text 
              variant="body2" 
              text="Browse and shop home goods" 
              color={theme.colors.textSecondary}
              align="center"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xxlg,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: theme.spacing.xlg,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  adminCard: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  userCard: {
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  footerText: {
    marginTop: theme.spacing.xxlg,
    marginBottom: theme.spacing.lg,
  },
})