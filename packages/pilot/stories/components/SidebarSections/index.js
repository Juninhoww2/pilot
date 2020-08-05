import React from 'react'

import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import SidebarSections from '../../../src/components/SidebarSections'

const sections = {
  data: [
    {
      action: action('clicked'),
      actionTitle: 'Sacar',
      showButton: true,
      title: 'Disponível',
      value: <span><small>R$</small> 15.000,00</span>,
    },
  ],
}

const SidebarSectionsExample = () => (
  <Section title="With base dark">
    <div style={{ backgroundColor: '#444444' }}>
      <SidebarSections sections={sections.data} />
    </div>
  </Section>
)

export default SidebarSectionsExample
