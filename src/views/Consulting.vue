<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>ESG 컨설턴트 찾기</h1>
                <br>
                <v-row>
                    <v-text-field v-model="search" placeholder="Search" prepend-inner-icon="mdi-magnify" solo></v-text-field>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-for="(section, index) in filteredSections" :key="index">
            <v-col cols="12">
                <h3>{{ section.title }}</h3>
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="(consultant, idx) in section.consultants" :key="idx">
                <v-card>
                    <v-card-title>
                        {{ consultant.company.companyName }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ consultant.company.managerName }} 매니저
                    </v-card-subtitle>
                    <v-card-text>
                        {{ consultant.company.managerPhone }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
    data() {
        return {
            search: '',
            accessToken: null,
            sections: []
        };
    },
    computed: {
        filteredSections() {
            if (!this.search) {
                return this.sections;
            }
            return this.sections.map(section => {
                return {
                    title: section.title,
                    consultants: section.consultants.filter(consultant => 
                        consultant.company.companyName.includes(this.search) || 
                        consultant.company.managerName.includes(this.search)
                    )
                };
            }).filter(section => section.consultants.length > 0);
        }
    },
    mounted() {
        this.fetchConsultants();
    },
    methods: {
        async getToken() {
            try {
                const user = firebase.auth().currentUser;
                if (user) {
                    const token = await user.getIdToken(true);
                    return token;
                } else {
                    console.error('User not authenticated');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching token:', error);
                return null;
            }
        },

        async fetchConsultants() {
            const token = await this.getToken();
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/api/consultant/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const consultants = response.data; // 데이터 구조에 맞게 변경
                console.log('Consultants Data:', consultants); // 데이터 로그 확인
                
                const sectionsMap = {};

                // 데이터를 섹션으로 분류
                consultants.forEach(consultant => {
                    const sectionTitle = consultant.subject.subjectName;
                    if (!sectionsMap[sectionTitle]) {
                        sectionsMap[sectionTitle] = {
                            title: sectionTitle,
                            consultants: []
                        };
                    }
                    sectionsMap[sectionTitle].consultants.push(consultant);
                });

                this.sections = Object.values(sectionsMap);
                console.log('Sections:', this.sections); // 섹션 로그 확인
            } catch (error) {
                console.error("Error:", error);
            }
        },
        viewDetails(consultant) {
            console.log('Consultant Details:', consultant); // 선택된 컨설턴트 로그 확인
        }
    },
};
</script>


<style scoped>
.v-card {
    margin-bottom: 20px;
}
</style>
