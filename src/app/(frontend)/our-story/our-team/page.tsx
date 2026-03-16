'use client'

import Image from 'next/image'
import { useLanguage } from '../../contexts/LanguageContext'
import '../styles.css'

interface TeamMember {
  name: string
  role: string
  image: string
}

interface TeamMemberConfig {
  name: string
  roleKey: string
  image: string
}

const teamMembersConfig: TeamMemberConfig[] = [
  {
    name: 'Dinesh',
    roleKey: 'founderManagingDirector',
    image: '/api/placeholder/300/400',
  },
  {
    name: 'Nimesha Madushani',
    roleKey: 'salesManager',
    image: '/api/placeholder/300/400',
  },
  {
    name: 'Reshani',
    roleKey: 'salesManager',
    image: '/api/placeholder/300/400',
  },
  {
    name: 'Nilusha',
    roleKey: 'accountant',
    image: '/api/placeholder/300/400',
  },
  {
    name: 'Amesha',
    roleKey: 'seniorExecutiveOperationsMarketing',
    image: '/api/placeholder/300/400',
  },
  {
    name: 'Kavindi',
    roleKey: 'accountsExecutive',
    image: '/api/placeholder/300/400',
  },
]

export default function OurTeamPage() {
  const { t } = useLanguage()

  const teamMembers: TeamMember[] = teamMembersConfig.map((member) => ({
    name: member.name,
    role: t(`teamRoles.${member.roleKey}`),
    image: member.image,
  }))

  return (
    <div className="our-team-page">
      <section className="our-team-hero">
        <div className="container">
          <h1 className="our-team-title">{t('ourTeam.title')}</h1>
          <div className="our-team-description">
            <p>{t('ourTeam.description1')}</p>
            <p>{t('ourTeam.description2')}</p>
          </div>
        </div>
      </section>

      <section className="our-team-grid-section">
        <div className="container">
          <div className="our-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="our-team-card">
                <div className="our-team-photo">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="our-team-image"
                  />
                </div>
                <div className="our-team-info">
                  <h3 className="our-team-name">{member.name}</h3>
                  <p className="our-team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
