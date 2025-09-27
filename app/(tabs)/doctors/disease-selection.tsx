import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#1976D2';
const LIGHT_BLUE = '#E3F2FD';
const WHITE = '#FFFFFF';

const HEALTH_PROBLEMS = [
  { id: 'mental-wellness', name: 'Mental Wellness', icon: '🧠', color: '#FF6B6B' },
  { id: 'gynaecology', name: 'Gynaecology', icon: '👩‍⚕️', color: '#4ECDC4' },
  { id: 'general-physician', name: 'General Physician', icon: '🩺', color: '#45B7D1' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴', color: '#96CEB4' },
  { id: 'orthopedic', name: 'Orthopedic', icon: '🦴', color: '#FFEAA7' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶', color: '#DDA0DD' },
  { id: 'sexology', name: 'Sexology', icon: '💑', color: '#98D8C8' },
];

const COMMON_ISSUES = [
  { id: 'stomach-pain', name: 'Stomach Pain', icon: '🤰', color: '#FFB6C1' },
  { id: 'vertigo', name: 'Vertigo', icon: '😵', color: '#87CEEB' },
  { id: 'acne', name: 'Acne', icon: '😔', color: '#F0E68C' },
  { id: 'pcos', name: 'PCOS', icon: '🩺', color: '#DDA0DD' },
  { id: 'fever', name: 'Fever', icon: '🌡️', color: '#FF6347' },
  { id: 'headache', name: 'Headache', icon: '🤕', color: '#FFD700' },
  { id: 'cough', name: 'Cough', icon: '🤧', color: '#98FB98' },
  { id: 'back-pain', name: 'Back Pain', icon: '🔙', color: '#F4A460' },
];

export default function DiseaseSelectionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSpecialtySelect = (specialtyId: string, specialtyName: string) => {
    router.push(`/doctors?specialty=${specialtyId}&name=${encodeURIComponent(specialtyName)}`);
  };

  const handleIssueSelect = (issueId: string, issueName: string) => {
    router.push(`/doctors?issue=${issueId}&name=${encodeURIComponent(issueName)}`);
  };

  const filteredProblems = HEALTH_PROBLEMS.filter(problem =>
    problem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIssues = COMMON_ISSUES.filter(issue =>
    issue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consult a Doctor</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpText}>HELP</Text>
        </TouchableOpacity>
      </View>

      {/* Promotional Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Free follow-up</Text>
          <Text style={styles.bannerSubtitle}>for 7 days with every consultation</Text>
          <TouchableOpacity>
            <Text style={styles.knowMore}>Know More ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerIcon}>
          <Text style={styles.bannerEmoji}>📋</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Health Problem / Symptoms</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search symptoms. Eg: Cold, cough, fever"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Top Specialities */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CHOOSE FROM TOP SPECIALITIES</Text>
          <View style={styles.grid}>
            {filteredProblems.map((problem) => (
              <TouchableOpacity
                key={problem.id}
                style={styles.gridItem}
                onPress={() => handleSpecialtySelect(problem.id, problem.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: problem.color + '20' }]}>
                  <Text style={styles.gridIcon}>{problem.icon}</Text>
                </View>
                <Text style={styles.gridText}>{problem.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Common Health Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Common Health Issues</Text>
          <View style={styles.grid}>
            {filteredIssues.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={styles.gridItem}
                onPress={() => handleIssueSelect(issue.id, issue.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: issue.color + '20' }]}>
                  <Text style={styles.gridIcon}>{issue.icon}</Text>
                </View>
                <Text style={styles.gridText}>{issue.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: WHITE,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  helpButton: {
    padding: 4,
  },
  helpText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  banner: {
    backgroundColor: LIGHT_BLUE,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  knowMore: {
    fontSize: 14,
    color: PRIMARY_BLUE,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bannerIcon: {
    marginLeft: 16,
  },
  bannerEmoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridIcon: {
    fontSize: 24,
  },
  gridText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
  },
  viewAllButton: {
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: PRIMARY_BLUE,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});