@@ .. @@
             {
               id: 'consult-doctor',
               icon: 'stethoscope', // Changed to represent medical consultation
               title: 'Consult Doctor',
               subtitle: 'Video & chat with specialists',
-              route: '/doctors',
+              route: '/doctors/disease-selection',
               image: 'https://via.placeholder.com/150/FFC107/000000?text=Consult+Doctor', // Placeholder image
               backgroundColor: '#FFFDE7', // Light yellow background
               iconColor: '#FBC02D', // Darker yellow for icon
@@ .. @@
             {
               id: 'check-symptoms',
               icon: 'clipboard-outline', // Changed to represent symptom checking
               title: 'Check Symptoms',
               subtitle: 'AI Symptom Checker',
-              route: '/check-symptoms',
+              route: '/symptom-checker',
               image: 'https://via.placeholder.com/150/E0F7FA/000000?text=AI+Checker', // Placeholder image
               backgroundColor: '#E0F7FA', // Light blue background
               iconColor: '#00BCD4', // Darker blue for icon
@@ .. @@
             {
               id: 'book-appointments',
               icon: 'calendar-outline',
               title: 'Book Appointments',
-              route: '/appointment',
+              route: '/book-appointment',
               color: '#2196F3', // Blue
             },
           ].map((item, index) => (
@@ .. @@
           <View style={styles.sectionHeader}>
             <Text style={[styles.sectionTitle, { color: '#111' }]}>Find a Doctor for your Health Problem</Text>
             <EnhancedVoiceButton 
               text="Find a Doctor for your Health Problem" 
               size={18} 
               onPress={() => console.log('Find Doctor voice triggered')}
               iconColor="#1976D2" // Blue for icons in white background sections
               style={{ backgroundColor: '#F0F4FF', borderColor: '#E0E7EF' }}
             />
           </View>
           {/* Common Health Problems Chips */}
           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
             {commonHealthProblems.map((problem, idx) => (
               <TouchableOpacity
                 key={problem}
                 style={[
                   styles.chip,
                   selectedProblem === problem && styles.chipSelected
                 ]}
-                onPress={() => setSelectedProblem(problem)}
+                onPress={() => {
+                  setSelectedProblem(problem);
+                  router.push('/doctors/disease-selection');
+                }}
                 activeOpacity={0.8}
               >
                 <Text style={[
                   styles.chipText,
                   selectedProblem === problem && styles.chipTextSelected
                 ]}>{problem}</Text>
               </TouchableOpacity>
             ))}
           </ScrollView>
           <View style={styles.specialtyGrid}>
             {specialtyItems.map((item, index) => (
               <TouchableOpacity
                 key={index}
                 style={[styles.specialtyItem, { backgroundColor: item.color }]}
-                onPress={() => router.push(item.route)}
+                onPress={() => router.push('/doctors/disease-selection')}
                 activeOpacity={0.9}
               >
                 <Text style={styles.specialtyIcon}>{item.icon}</Text>
                 <Text style={styles.specialtyTitle}>{item.title}</Text>
               </TouchableOpacity>
             ))}
           </View>
         </View>