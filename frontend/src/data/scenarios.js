// Client-side scenario definitions (identical to backend data for 100% offline autonomy)
export const SCENARIOS = [
  {
    id: "metro",
    title: "Late Night Metro Car",
    subtitle: "Public Transit Enclosure // 23:42 HRS",
    location: "Metro Line 4 (Subterranean transit car)",
    environment: "Confined public space, limited exit points until next station",
    bystanderProximity: "Approx. 4.5 meters",
    initialState: {
      tension: 42,
      victimSafetyIndex: 58,
      bystanderExposure: 20,
      timeElapsed: 0,
      sceneId: "metro_entry"
    },
    contextLabels: {
      Distract: "Interrupt transit focus with travel inquiry",
      Delegate: "Alert conductor or rally adjacent commuters",
      Document: "Discreetly log carriage ID & timestamp",
      Delay: "Maintain proximity & plan station platform exit",
      Direct: "Issue firm verbal boundary: 'Step back'"
    },
    scenes: {
      metro_entry: {
        id: "metro_entry",
        title: "Station Departure // Unwelcome Incursion",
        narrative: "You board Carriage 04 at 23:42. A passenger in a heavy parka is leaning invasively over a lone commuter sitting near the exit door. The passenger is making persistent, intrusive remarks about where she is travelling and blocking her knee room. The commuter has her earphones gripped in one hand and repeatedly leans against the window to create distance. Three other passengers are scattered across the car, looking down at their phones.",
        tension: 42,
        victimSafetyIndex: 58,
        bystanderExposure: 20,
        options: {
          Distract: {
            d: "Distract",
            label: "Ask for Station Destination",
            actionText: "I step into the aisle, make polite eye contact with the commuter, and ask: 'Excuse me, does this train stop at Central Station or do we transfer at 8th?'",
            targetSceneId: "metro_distracted",
            tensionDelta: -12,
            safetyDelta: +16,
            exposureDelta: +8,
            critique: "A conversational interruption shifts focus without triggering an immediate defensive reaction from the aggressor.",
            potentialBenefits: [
              "Gives the commuter a low-conflict reason to look away and engage",
              "Disrupts the aggressor's momentum without direct confrontation"
            ],
            potentialRisks: [
              "Aggressor may redirect annoyance toward you if they suspect a deliberate ruse"
            ],
            recommendedNextStep: "Offer a reason for the commuter to stand or change seats with you before the next stop."
          },
          Delegate: {
            d: "Delegate",
            label: "Signal Adjacent Passenger & Intercom",
            actionText: "I catch the eye of the commuter across the aisle, nod toward the situation, and point quietly to the carriage emergency intercom.",
            targetSceneId: "metro_delegated",
            tensionDelta: -8,
            safetyDelta: +18,
            exposureDelta: +5,
            critique: "Enlisting allies reduces isolation and shares responsibility without immediate public escalation.",
            potentialBenefits: [
              "Transforms passive bystanders into active observers",
              "Establishes a backup safety plan before taking further steps"
            ],
            potentialRisks: [
              "The other bystander may hesitate or ignore your signal"
            ],
            recommendedNextStep: "Position yourself visibly closer so the affected passenger knows she is supported."
          },
          Document: {
            d: "Document",
            label: "Log Car Number & Timestamp",
            actionText: "I take out my phone, note Carriage #4082, the exact time (23:43), and discreetly observe physical descriptions without overtly recording video.",
            targetSceneId: "metro_documented",
            tensionDelta: +2,
            safetyDelta: +4,
            exposureDelta: +2,
            critique: "Documentation provides verifiable accountability, but alone it does not alter the immediate physical danger.",
            potentialBenefits: [
              "Captures crucial official telemetry (car number, timestamp)",
              "Keeps your own exposure low while observing"
            ],
            potentialRisks: [
              "Does not provide immediate de-escalation for the targeted commuter"
            ],
            recommendedNextStep: "Pair documentation with a de-escalation method like Distract or Delegate before the next stop."
          },
          Delay: {
            d: "Delay",
            label: "Position Near Platform Door & Wait",
            actionText: "I stand near the exit door within 2 meters, keeping clear sightlines, ready to assist the commuter the moment the train decelerates into the platform.",
            targetSceneId: "metro_delayed",
            tensionDelta: 0,
            safetyDelta: +8,
            exposureDelta: +6,
            critique: "Delaying intervention until an open exit point is available avoids trapping the victim in high-friction confrontation in a moving car.",
            potentialBenefits: [
              "Prepares an immediate exit strategy at the upcoming platform",
              "Provides immediate physical proximity without alarming the harasser"
            ],
            potentialRisks: [
              "Intrusive behavior may intensify before the train reaches the platform"
            ],
            recommendedNextStep: "Be ready to invite the commuter to step out onto the well-lit platform as doors slide open."
          },
          Direct: {
            d: "Direct",
            label: "Verbal Boundary: 'Give Her Space'",
            actionText: "I step firmly forward and say clearly: 'Excuse me, you are crowding her and she asked you to stop. Please step back to your own seat.'",
            targetSceneId: "metro_direct_confront",
            tensionDelta: +18,
            safetyDelta: +10,
            exposureDelta: +28,
            critique: "Direct boundary setting signals that harassment will not go unchallenged, but significantly escalates tension in a confined underground car.",
            potentialBenefits: [
              "Draws attention of all passengers to the violation",
              "May shock the harasser into halting their intimidation"
            ],
            potentialRisks: [
              "High risk of physical redirection or aggressive retaliation in an enclosed space",
              "Victim may feel exposed or panic"
            ],
            recommendedNextStep: "Keep hands visible, do not invade physical space, and invite other commuters to step in."
          }
        }
      },
      metro_distracted: {
        id: "metro_distracted",
        title: "Deflected Attention // Deceleration Phase",
        narrative: "The commuter glances up with visible relief and quickly answers: 'No, this one goes straight to Central, but I'm getting off at 8th Street next.' The harasser scowls, turns his head toward you, and mutters under his breath, stepping back roughly two feet. Train brakes begin screeching as the carriage enters the tunnel approach for 8th Street Station.",
        tension: 30,
        victimSafetyIndex: 74,
        bystanderExposure: 28,
        options: {
          Distract: {
            d: "Distract",
            label: "Offer Seat Swap or Walk Together",
            actionText: "I say warmly: 'Great, I'm heading out at 8th as well. Mind if I grab the aisle here so we can exit together?'",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -16,
            safetyDelta: +22,
            exposureDelta: +4,
            critique: "Building a supportive physical shield and accompanying the target to an open platform effectively concludes the incident.",
            potentialBenefits: ["Enables smooth exit onto populated platform", "Defuses remaining friction"],
            potentialRisks: ["Harasser could attempt to follow off the train"],
            recommendedNextStep: "Guide commuter toward station booth or platform CCTV coverage."
          },
          Delegate: {
            d: "Delegate",
            label: "Alert Platform Attendant",
            actionText: "As doors open, I signal the platform transit officer standing by the turnstiles and briefly describe the harassment.",
            targetSceneId: "metro_assisted_exit",
            tensionDelta: -14,
            safetyDelta: +24,
            exposureDelta: -6,
            critique: "Handing off to uniformed station authorities secures professional oversight without personal risk.",
            potentialBenefits: ["Official enforcement presence", "High victim protection"],
            potentialRisks: ["Transit staff might take time to respond"],
            recommendedNextStep: "Offer contact info as a witness if the commuter wishes to file a report."
          },
          Direct: {
            d: "Direct",
            label: "Block Harasser from Following",
            actionText: "As the commuter stands up, I position myself between her and the harasser, stating firmly: 'Stay right there.'",
            targetSceneId: "metro_tense_standoff",
            tensionDelta: +22,
            safetyDelta: +6,
            exposureDelta: +34,
            critique: "Physical body blocking can ensure victim escape but risks physical scuffle on the threshold.",
            potentialBenefits: ["Guarantees target gets through doors unhindered"],
            potentialRisks: ["Could provoke physical assault from an agitated individual"],
            recommendedNextStep: "Disengage immediately as doors close or platform security approaches."
          },
          Delay: {
            d: "Delay",
            label: "Check-in Post Departure",
            actionText: "I exit behind the commuter and ask calmly: 'Are you alright? Would you like me to wait with you while you get your cab or transfer?'",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -18,
            safetyDelta: +20,
            exposureDelta: -8,
            critique: "Post-incident checking affirms victim autonomy and provides comforting emotional safety.",
            potentialBenefits: ["Victim feels supported and regains agency", "Zero risk of in-transit escalation"],
            potentialRisks: ["Minimal risk once on public platform"],
            recommendedNextStep: "Respect her response if she prefers to walk alone."
          },
          Document: {
            d: "Document",
            label: "Photocapture Station Exit Signs",
            actionText: "I record the timestamp and platform exit surveillance camera zone.",
            targetSceneId: "metro_assisted_exit",
            tensionDelta: -4,
            safetyDelta: +8,
            exposureDelta: +2,
            critique: "Station infrastructure logging helps corroborate witness testimony.",
            potentialBenefits: ["Verifiable corroboration"],
            potentialRisks: ["Passive action does not directly ensure victim support"],
            recommendedNextStep: "Proceed with emotional check-in."
          }
        }
      },
      metro_delegated: {
        id: "metro_delegated",
        title: "Allies Mobilized // Collective Presence",
        narrative: "The passenger across the aisle nods in understanding. Two other commuters stand up and move into the center aisle, forming a visible cluster of witnesses. Sensing the shift in room dynamics, the aggressor curses, sits down roughly, and folds his arms aggressively against the wall. The train announces arrival at 8th Street.",
        tension: 34,
        victimSafetyIndex: 76,
        bystanderExposure: 14,
        options: {
          Delay: {
            d: "Delay",
            label: "Offer Supportive Escort",
            actionText: "I quietly ask the woman: 'We are all getting off here. Would you like us to walk with you to the station booth?'",
            targetSceneId: "metro_assisted_exit",
            tensionDelta: -16,
            safetyDelta: +20,
            exposureDelta: -4,
            critique: "Collective community presence neutralizes intimidation while centering victim dignity.",
            potentialBenefits: ["Overwhelming deterrence", "Complete victim safety"],
            potentialRisks: ["Overcrowding the victim if she feels overwhelmed"],
            recommendedNextStep: "Confirm her destination preference."
          },
          Direct: {
            d: "Direct",
            label: "Call Transit Emergency Intercom",
            actionText: "I press the carriage emergency speaker: 'Driver, we have an aggressive passenger harassing commuters in car 04.'",
            targetSceneId: "metro_police_intervention",
            tensionDelta: +16,
            safetyDelta: +18,
            exposureDelta: +16,
            critique: "Engaging train driver emergency channels triggers mandatory security response at next stop.",
            potentialBenefits: ["Guaranteed security response at station platform"],
            potentialRisks: ["Train may be held, creating tense waiting period"],
            recommendedNextStep: "Keep eyes on aggressor until transit safety officers arrive."
          },
          Distract: {
            d: "Distract",
            label: "Engage Affected Passenger in Transit Dialogue",
            actionText: "I suggest she join our group near the doors to exit smoothly.",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -12,
            safetyDelta: +18,
            exposureDelta: -2,
            critique: "Natural, non-escalatory exit coordination.",
            potentialBenefits: ["Smooth transition out of carriage"],
            potentialRisks: ["None apparent"],
            recommendedNextStep: "Exit onto platform."
          },
          Document: {
            d: "Document",
            label: "Coordinate Witness Numbers",
            actionText: "I exchange phone numbers with the assisting commuter to ensure witness records.",
            targetSceneId: "metro_assisted_exit",
            tensionDelta: -4,
            safetyDelta: +10,
            exposureDelta: +2,
            critique: "Consolidates witness integrity.",
            potentialBenefits: ["Solid evidentiary foundation"],
            potentialRisks: ["Administrative focus during active movement"],
            recommendedNextStep: "Support commuter first."
          }
        }
      },
      metro_documented: {
        id: "metro_documented",
        title: "Surveillance Telemetry Recorded",
        narrative: "You have discreetly saved the carriage identifier and time. However, the aggressor continues leaning closer, tapping the window near the commuter's ear. She appears increasingly cornered and glances anxiously toward the other passengers.",
        tension: 48,
        victimSafetyIndex: 46,
        bystanderExposure: 18,
        options: {
          Distract: {
            d: "Distract",
            label: "Drop Water Bottle & Stumble",
            actionText: "I intentionally drop my metal water bottle with a loud clang, creating a sudden break in focus, and apologize profusely.",
            targetSceneId: "metro_distracted",
            tensionDelta: -14,
            safetyDelta: +22,
            exposureDelta: +8,
            critique: "A physical distraction breaks the fixation cycle without putting anyone directly on the spot.",
            potentialBenefits: ["Immediate disruption of threatening posture"],
            potentialRisks: ["Minor disruption, temporary effect"],
            recommendedNextStep: "Use the pause to initiate a conversation with the commuter."
          },
          Direct: {
            d: "Direct",
            label: "Direct Verbal Intervention",
            actionText: "I walk over and state: 'Leave her alone right now. This carriage has cameras.'",
            targetSceneId: "metro_direct_confront",
            tensionDelta: +24,
            safetyDelta: +12,
            exposureDelta: +32,
            critique: "High-friction direct confrontation.",
            potentialBenefits: ["Shows zero tolerance"],
            potentialRisks: ["May cause aggressor to retaliate physically"],
            recommendedNextStep: "Prepare to disengage or seek backup."
          },
          Delay: {
            d: "Delay",
            label: "Wait for Station Deceleration",
            actionText: "I wait until train enters platform and immediately step beside her.",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -8,
            safetyDelta: +14,
            exposureDelta: +4,
            critique: "Strategic patience pays off as physical exit arrives.",
            potentialBenefits: ["Exit available immediately"],
            potentialRisks: ["Minutes of acute distress for victim"],
            recommendedNextStep: "Exit and verify safety."
          }
        }
      },
      metro_delayed: {
        id: "metro_delayed",
        title: "Platform Approach // Tactical Proximity",
        narrative: "You position yourself by the door. The train decelerates and platform lights begin sweeping across the carriage windows. The harasser senses the upcoming stop and makes a final aggressive remark, but notices your attentive stance right beside the doors.",
        tension: 40,
        victimSafetyIndex: 66,
        bystanderExposure: 22,
        options: {
          Delay: {
            d: "Delay",
            label: "Open Doors & Escort to Platform",
            actionText: "As doors chime and slide open, I step out, turn to the commuter, and say: 'Let's head up to the station concourse together.'",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -20,
            safetyDelta: +28,
            exposureDelta: -6,
            critique: "Smooth hand-off from transit enclosure to public open space.",
            potentialBenefits: ["Victim reaches safety effortlessly"],
            potentialRisks: ["Ensure harasser remains on train"],
            recommendedNextStep: "Check in warmly and respect her wishes."
          },
          Delegate: {
            d: "Delegate",
            label: "Alert Platform Security Immediately",
            actionText: "I wave down the transit security officers standing on the platform.",
            targetSceneId: "metro_assisted_exit",
            tensionDelta: -18,
            safetyDelta: +30,
            exposureDelta: -10,
            critique: "Ideal transition to safety personnel.",
            potentialBenefits: ["Trained response, complete safety"],
            potentialRisks: ["None"],
            recommendedNextStep: "Provide brief factual statement."
          }
        }
      },
      metro_direct_confront: {
        id: "metro_direct_confront",
        title: "Direct Friction // Volatile Threshold",
        narrative: "The man stands up aggressively, towering over you: 'Who asked you? Mind your own business before you get hurt!' The affected commuter shrinks back, looking terrified that a physical brawl is about to erupt. Other passengers shrink into their seats. The train jolts as it brakes for 8th Street.",
        tension: 78,
        victimSafetyIndex: 42,
        bystanderExposure: 65,
        options: {
          Distract: {
            d: "Distract",
            label: "De-escalate & Shift to Station Arrival",
            actionText: "I keep palms open at chest height, step slightly back, and say calmly: 'Train is stopping here. Everyone is just getting home.'",
            targetSceneId: "metro_safe_exit",
            tensionDelta: -28,
            safetyDelta: +25,
            exposureDelta: -20,
            critique: "Calm, non-confrontational boundary reset pulls back from physical violence.",
            potentialBenefits: ["Lowers adrenaline, allows safe egress"],
            potentialRisks: ["Aggressor may still be riled"],
            recommendedNextStep: "Exit train immediately with commuter."
          },
          Delegate: {
            d: "Delegate",
            label: "Hit Emergency Intercom Now",
            actionText: "I immediately press the emergency intercom: 'Security needed at Car 04!'",
            targetSceneId: "metro_police_intervention",
            tensionDelta: +10,
            safetyDelta: +20,
            exposureDelta: +10,
            critique: "Emergency call brings enforcement when physical threat is imminent.",
            potentialBenefits: ["Enforcement arrives upon door opening"],
            potentialRisks: ["High immediate tension"],
            recommendedNextStep: "Keep defensive distance."
          }
        }
      },
      // Endings
      metro_safe_exit: {
        id: "metro_safe_exit",
        isEnding: true,
        endingType: "Strategic De-escalation & Safe Exit",
        title: "Platform Egress // Safe Resolution",
        narrative: "You and the commuter step out onto the brightly lit 8th Street platform. The doors close and the train continues into the dark tunnel with the harasser inside. The commuter exhales deeply, trembling slightly: 'Thank you so much. I didn't know what he was going to do.' You sit with her on a bench near the station agent booth until her ride arrives.",
        tension: 18,
        victimSafetyIndex: 92,
        bystanderExposure: 12,
        readinessScore: 94,
        interventionStyle: "Strategic Deflector",
        strengths: [
          "Recognized that confined public transport limits direct aggression options",
          "Used distraction and delay to time intervention with station arrival"
        ],
        improvements: [
          "Continue checking if the affected person wants official transit security logging",
          "Ensure you don't compromise your own exit path in subterranean environments"
        ],
        reflectionQuestion: "How did timing the intervention with the train's arrival reduce the risk of trapped physical retaliation?"
      },
      metro_assisted_exit: {
        id: "metro_assisted_exit",
        isEnding: true,
        endingType: "Institutional Delegation Success",
        title: "Station Staff Handover // Secure Transition",
        narrative: "Platform transit officers intercept the carriage doors upon arrival. While officers speak with the agitated individual inside the car, a station customer assistant escorts the commuter to the operations booth. You provide a calm witness account including car number and time. The commuter thanks you for having her back without making the scene chaotic.",
        tension: 15,
        victimSafetyIndex: 96,
        bystanderExposure: 8,
        readinessScore: 96,
        interventionStyle: "Authority Delegator",
        strengths: [
          "Mastered the Delegate protocol by mobilizing trained transit staff",
          "Maintained documentation without escalating physical danger"
        ],
        improvements: [
          "Always verify with the victim whether she feels comfortable speaking with transit police"
        ],
        reflectionQuestion: "Why is delegating to trained transport personnel often safer than engaging in solo physical confrontation?"
      },
      metro_police_intervention: {
        id: "metro_police_intervention",
        isEnding: true,
        endingType: "Emergency Intervention",
        title: "Emergency Protocol // Lockdown Arrival",
        narrative: "The train halts at 8th Street with alarm bells ringing. Transit police board the carriage and restrain the aggressor who continues shouting. Commuters are ushered off in an orderly fashion. While the immediate threat was neutralized, the high level of adrenaline and public chaos left the affected commuter visibly shaken.",
        tension: 65,
        victimSafetyIndex: 82,
        bystanderExposure: 35,
        readinessScore: 78,
        interventionStyle: "System Escalator",
        strengths: [
          "Promptly recognized when danger escalated beyond informal intervention",
          "Secured institutional authority intervention"
        ],
        improvements: [
          "Consider lower-friction distractions first to prevent acute panic",
          "Check in on the affected person's emotional shock following heavy police response"
        ],
        reflectionQuestion: "What is the psychological toll on the affected commuter when emergency sirens and transit lockdown are triggered?"
      },
      metro_tense_standoff: {
        id: "metro_tense_standoff",
        isEnding: true,
        endingType: "Escalated Confrontation",
        title: "Confrontation Volatility // Escalated Risk",
        narrative: "A volatile physical standoff erupts between you and the aggressor right at the carriage threshold. Commuters scatter in alarm. The victim flees in panic into the station crowd without any debrief or support. Station security eventually breaks up the fight, requiring statements from all involved.",
        tension: 88,
        victimSafetyIndex: 50,
        bystanderExposure: 82,
        readinessScore: 52,
        interventionStyle: "Aggressive Confrontationalist",
        strengths: [
          "Willingness to act rather than passively ignore intimidation"
        ],
        improvements: [
          "Never prioritize physical combat over the victim's physical and emotional safety",
          "Remember: the goal of bystander intervention is de-escalation, not winning a fight"
        ],
        reflectionQuestion: "When a bystander turns confrontational, why does the victim often end up feeling more frightened and isolated?"
      }
    }
  },
  {
    id: "campus",
    title: "University Library / Hallway",
    subtitle: "Academic Facility // 16:15 HRS",
    location: "Science Library 3rd Floor, West Wing Hallway",
    environment: "Semi-quiet academic corridor, study cubicles, library front desk 30m away",
    bystanderProximity: "Approx. 3.0 meters",
    initialState: {
      tension: 38,
      victimSafetyIndex: 64,
      bystanderExposure: 15,
      timeElapsed: 0,
      sceneId: "campus_entry"
    },
    contextLabels: {
      Distract: "Request study assistance or group room key",
      Delegate: "Notify librarian or campus safety desk",
      Document: "Discreetly record student ID lanyard or location",
      Delay: "Wait nearby until student is free to walk to atrium",
      Direct: "State firmly: 'Let them pass, you are blocking the corridor'"
    },
    scenes: {
      campus_entry: {
        id: "campus_entry",
        title: "Narrow Corridor // Physical Obstruction",
        narrative: "On the 3rd floor corridor of the campus library, a male student has stepped directly into the path of a female peer, cornering her against a row of study lockers. He is leaning in aggressively, demanding explanations about why she ignored his messages and refusing to let her pass into the reading room. Her backpack is slipping off her shoulder as she clutches her textbooks to her chest. Several students at nearby study carrels glance over uncomfortably.",
        tension: 38,
        victimSafetyIndex: 64,
        bystanderExposure: 15,
        options: {
          Distract: {
            d: "Distract",
            label: "Ask for Study Group Room",
            actionText: "I walk down the hallway with my notebook open, smile, and say: 'Hey, sorry to interrupt! Were you guys in Professor Miller's Organic Chem review? Do you know if Room 304 is reserved?'",
            targetSceneId: "campus_distracted",
            tensionDelta: -14,
            safetyDelta: +18,
            exposureDelta: +6,
            critique: "Introducing an academic, everyday topic immediately breaks the tense intimacy the aggressor is trying to impose.",
            potentialBenefits: [
              "Gives the student an obvious excuse to step away from the locker",
              "Non-threatening social pivot that cools the harasser's tempo"
            ],
            potentialRisks: [
              "Harasser might brush you off with 'We're talking, beat it'"
            ],
            recommendedNextStep: "Invite her to walk with you to check the room schedule."
          },
          Delegate: {
            d: "Delegate",
            label: "Alert Library Help Desk & Security",
            actionText: "I turn back to the circulation desk 30 meters away and whisper to the library staff member: 'There is a student blocking someone aggressively by Locker Bay B.'",
            targetSceneId: "campus_staff_alerted",
            tensionDelta: -10,
            safetyDelta: +20,
            exposureDelta: +3,
            critique: "Library staff and campus monitors have jurisdiction and institutional authority to intervene calmly.",
            potentialBenefits: [
              "Staff authority carries institutional weight without creating physical street fights",
              "Low personal risk for bystander"
            ],
            potentialRisks: [
              "Staff may take 1-2 minutes to walk over"
            ],
            recommendedNextStep: "Return to the corridor to maintain visual contact until staff arrives."
          },
          Document: {
            d: "Document",
            label: "Note Locker Bay & Timestamp",
            actionText: "I stand near the water fountain, pull out my tablet, and note the time (16:16), Locker Bay B, and the perpetrator's jacket insignia.",
            targetSceneId: "campus_documented",
            tensionDelta: +2,
            safetyDelta: +4,
            exposureDelta: +2,
            critique: "Documentation records accountability but leaves the cornered student under ongoing coercion.",
            potentialBenefits: [
              "Accurate institutional record for Title IX or campus safety"
            ],
            potentialRisks: [
              "Allows physical blocking to persist unchallenged"
            ],
            recommendedNextStep: "Transition to a low-risk Distract or Delegate intervention."
          },
          Delay: {
            d: "Delay",
            label: "Hold Door & Await Movement",
            actionText: "I prop open the adjacent study hall glass door and remain standing right at the threshold, watching intently.",
            targetSceneId: "campus_delayed",
            tensionDelta: -4,
            safetyDelta: +10,
            exposureDelta: +8,
            critique: "Visible presence lets the harasser know he has an audience, often sufficient to temper bullying.",
            potentialBenefits: [
              "Creates an open exit pathway into a populated room"
            ],
            potentialRisks: [
              "Passive observation may not break the physical blockade"
            ],
            recommendedNextStep: "Call out to the student to come in."
          },
          Direct: {
            d: "Direct",
            label: "Direct Command: 'Step Aside Now'",
            actionText: "I walk up directly, look the blocking student in the eye, and say: 'Step aside. You are blocking the corridor and making her uncomfortable.'",
            targetSceneId: "campus_direct_confront",
            tensionDelta: +22,
            safetyDelta: +10,
            exposureDelta: +25,
            critique: "Direct confrontation asserts clear community standards, but may cause the aggressor to react defensively to save face.",
            potentialBenefits: [
              "Instant disruption of intimidation",
              "Clear message that campus norms forbid physical blocking"
            ],
            potentialRisks: [
              "Ego threat could trigger loud shouting match in silent library zone"
            ],
            recommendedNextStep: "Focus on getting the student out rather than arguing."
          }
        }
      },
      campus_distracted: {
        id: "campus_distracted",
        title: "Interruption Success // Corridor Cleared",
        narrative: "The cornered student seizes the moment instantly: 'Yes! Room 304, let me show you where it is!' She ducks under his arm and walks over to your side. The aggressor stands frozen with a sour expression, hands shoved in his pockets, glancing at the other students who are now watching.",
        tension: 24,
        victimSafetyIndex: 82,
        bystanderExposure: 18,
        options: {
          Distract: {
            d: "Distract",
            label: "Walk Together to Main Atrium",
            actionText: "I say: 'Awesome, thanks! Let's head down to the first-floor cafe, it's way easier to study there.'",
            targetSceneId: "campus_safe_exit",
            tensionDelta: -12,
            safetyDelta: +14,
            exposureDelta: -6,
            critique: "Moves the student from a secluded corridor to a bustling public space.",
            potentialBenefits: ["Complete removal from the scene of intimidation"],
            potentialRisks: ["None"],
            recommendedNextStep: "Offer genuine emotional check-in once in the cafe."
          },
          Delay: {
            d: "Delay",
            label: "Debrief in Reading Room",
            actionText: "We take seats in the open reading room. I ask softly: 'Are you okay? Do you need a minute or someone to stay with you?'",
            targetSceneId: "campus_safe_exit",
            tensionDelta: -14,
            safetyDelta: +12,
            exposureDelta: -8,
            critique: "Empathetic check-in restores personal agency.",
            potentialBenefits: ["Validates her feelings without imposing judgment"],
            potentialRisks: ["None"],
            recommendedNextStep: "Offer quiet companionship."
          }
        }
      },
      campus_staff_alerted: {
        id: "campus_staff_alerted",
        title: "Staff Arrival // Institutional Response",
        narrative: "A senior library supervisor and a campus safety officer walk swiftly down the 3rd floor corridor. The supervisor steps calmly between the students: 'Excuse me folks, we have quiet hours on this floor and hallways must remain completely unobstructed.' The aggressor immediately drops his defensive posture, mumbles an apology, and takes the elevator down.",
        tension: 18,
        victimSafetyIndex: 90,
        bystanderExposure: 6,
        options: {
          Delay: {
            d: "Delay",
            label: "Supportive Check-in After Staff Depart",
            actionText: "Once the staff finish their round, I ask the student if she'd like someone to walk with her to her next class.",
            targetSceneId: "campus_safe_exit",
            tensionDelta: -8,
            safetyDelta: +8,
            exposureDelta: -2,
            critique: "Thoughtful post-incident follow-through.",
            potentialBenefits: ["Affirms ongoing peer safety net"],
            potentialRisks: ["None"],
            recommendedNextStep: "Walk together calmly."
          }
        }
      },
      campus_direct_confront: {
        id: "campus_direct_confront",
        title: "Confrontation in Corridor // Raised Voices",
        narrative: "The student snaps back: 'Who the hell are you? Mind your own business!' He steps into your personal space, red-faced. Several library patrons stand up from their cubicles to watch. The affected student looks mortified by the sudden public spectacle.",
        tension: 74,
        victimSafetyIndex: 48,
        bystanderExposure: 55,
        options: {
          Distract: {
            d: "Distract",
            label: "Pivot to Help Desk Staff Call",
            actionText: "I ignore his taunts, turn to the woman, and say: 'Let's head to the front desk together, come on.'",
            targetSceneId: "campus_safe_exit",
            tensionDelta: -24,
            safetyDelta: +30,
            exposureDelta: -18,
            critique: "De-escalates by refusing to take the bait and refocusing on victim extraction.",
            potentialBenefits: ["Breaks the argument, removes target"],
            potentialRisks: ["Aggressor may shout after you"],
            recommendedNextStep: "Proceed to main desk."
          }
        }
      },
      campus_documented: {
        id: "campus_documented",
        title: "Observer Telemetry // Unresolved Standoff",
        narrative: "You have recorded the incident details, but the aggressor continues leaning over her, waving his hand dismissively as she tries to step around him. A tutor at an adjacent table looks over at you, clearly wondering if anyone will intervene.",
        tension: 44,
        victimSafetyIndex: 52,
        bystanderExposure: 14,
        options: {
          Distract: {
            d: "Distract",
            label: "Ask for Tutor's Help to Form Group Inquiry",
            actionText: "I whisper to the tutor: 'Can we both walk up and ask them for directions to break this up?'",
            targetSceneId: "campus_distracted",
            tensionDelta: -16,
            safetyDelta: +24,
            exposureDelta: +4,
            critique: "Combines collective bystander power with gentle distraction.",
            potentialBenefits: ["Multi-person disruption without confrontation"],
            potentialRisks: ["None"],
            recommendedNextStep: "Walk up together."
          }
        }
      },
      campus_delayed: {
        id: "campus_delayed",
        title: "Opened Pathway // Awaiting Motion",
        narrative: "Holding the glass door open creates a clear view into the populated study area. The aggressor glances back and realizes he is framed against a bright glass doorway with onlookers. He pauses his berating.",
        tension: 32,
        victimSafetyIndex: 72,
        bystanderExposure: 16,
        options: {
          Distract: {
            d: "Distract",
            label: "Call Her In for the Reserved Table",
            actionText: "I call out: 'Hey, our table in here is ready, come on over!'",
            targetSceneId: "campus_safe_exit",
            tensionDelta: -14,
            safetyDelta: +18,
            exposureDelta: -4,
            critique: "Capitalizes on the prepared open door to finalize the exit.",
            potentialBenefits: ["Clear and seamless invitation"],
            potentialRisks: ["None"],
            recommendedNextStep: "Welcome her inside."
          }
        }
      },
      campus_safe_exit: {
        id: "campus_safe_exit",
        isEnding: true,
        endingType: "Quiet De-escalation & Safe Exit",
        title: "Atrium Sanctuary // Safe Outcome",
        narrative: "The student joins you down in the vibrant library atrium cafe. She takes a sip of water and thanks you genuinely: 'I felt so trapped against those lockers. He wouldn't let me pass. You handling it without a giant screaming match was exactly what I needed.' She calls a close friend who arrives to walk with her to the dorms.",
        tension: 14,
        victimSafetyIndex: 95,
        bystanderExposure: 8,
        readinessScore: 95,
        interventionStyle: "Supportive Deflector",
        strengths: [
          "Preserved the victim's agency and dignity in an academic environment",
          "Effectively extracted the target without creating an embarrassing public spectacle"
        ],
        improvements: [
          "Offer campus student conduct hotline resources if she desires follow-up action"
        ],
        reflectionQuestion: "Why is preserving the affected person's privacy and dignity especially critical in a university or workplace environment?"
      }
    }
  },
  {
    id: "bus_stop",
    title: "Street Bus Stop",
    subtitle: "Urban Thoroughfare // 21:10 HRS",
    location: "4th Avenue & Pine Street (Curbside Transit Shelter)",
    environment: "Open street, night lighting, corner grocery store 20 meters away, oncoming traffic",
    bystanderProximity: "Approx. 4.0 meters",
    initialState: {
      tension: 48,
      victimSafetyIndex: 52,
      bystanderExposure: 25,
      timeElapsed: 0,
      sceneId: "bus_entry"
    },
    contextLabels: {
      Distract: "Inquire about bus schedule or offer umbrella",
      Delegate: "Engage corner bodega shopkeeper or fellow commuters",
      Document: "Discreetly photograph bus shelter ID & cross streets",
      Delay: "Keep watchful watch until bus arrives, then board together",
      Direct: "State clearly: 'She does not wish to speak with you'"
    },
    scenes: {
      bus_entry: {
        id: "bus_entry",
        title: "Shelter Enclosure // Persistent Interrogation",
        narrative: "Rain is beginning to fall at 21:10. At a dimly lit glass bus shelter, a stranger has sat down immediately next to a solitary woman, repeatedly interrogating her about where she lives, where she works, and why she won't give him her social media handle. She has pulled her coat collar high, repeatedly answering 'I don't give that out' while glancing nervously down the empty road for the bus. You are standing under the awning of a corner grocery store 20 meters away.",
        tension: 48,
        victimSafetyIndex: 52,
        bystanderExposure: 25,
        options: {
          Distract: {
            d: "Distract",
            label: "Approach with Bus Schedule Inquiry",
            actionText: "I walk over under my umbrella, step under the shelter, and ask: 'Excuse me, do either of you know if the 42 bus has passed yet? The tracking app is saying delayed.'",
            targetSceneId: "bus_distracted",
            tensionDelta: -16,
            safetyDelta: +20,
            exposureDelta: +8,
            critique: "A simple logistical inquiry at a transit stop is natural, non-provocative, and punctures the predator's isolation tactic.",
            potentialBenefits: [
              "Breaks the persistent questioning immediately",
              "Gives the woman an ally and a conversational bridge"
            ],
            potentialRisks: [
              "Aggressor might answer curtly to re-isolate her"
            ],
            recommendedNextStep: "Offer to share umbrella space or suggest waiting inside the lighted grocery shop."
          },
          Delegate: {
            d: "Delegate",
            label: "Enlist Bodega Shopkeeper",
            actionText: "I step inside the corner bodega and say to the cashier: 'Hi, there's a guy aggressively badgering a woman at the shelter. Could we invite her inside until the bus arrives?'",
            targetSceneId: "bus_bodega_refuge",
            tensionDelta: -12,
            safetyDelta: +22,
            exposureDelta: +4,
            critique: "Small neighborhood businesses serve as vital community safe havens with active staff and surveillance cameras.",
            potentialBenefits: [
              "Provides an immediate dry, well-lit, staffed shelter alternative",
              "Brings local merchant authority to bear"
            ],
            potentialRisks: [
              "Woman still needs to walk the 20 meters from the shelter"
            ],
            recommendedNextStep: "Go with shopkeeper's blessing to invite her inside."
          },
          Document: {
            d: "Document",
            label: "Discreetly Record Location & Suspect",
            actionText: "I log the bus shelter stop number (#8491), cross streets (4th & Pine), and take a wide photo of the shelter from across the sidewalk.",
            targetSceneId: "bus_documented",
            tensionDelta: +2,
            safetyDelta: +4,
            exposureDelta: +2,
            critique: "Documenting creates objective evidence, but leaves the victim exposed on a rainy street corner.",
            potentialBenefits: [
              "Verifiable location records in case of emergency escalation"
            ],
            potentialRisks: [
              "Fails to relieve acute distress or potential physical threat"
            ],
            recommendedNextStep: "Actively intervene using Distract or Delegate."
          },
          Delay: {
            d: "Delay",
            label: "Maintain Watchful Presence at Curb",
            actionText: "I walk over to the shelter curb, unfold my umbrella, and stand right by the timetable glass panel, keeping clear visual eye contact.",
            targetSceneId: "bus_delayed",
            tensionDelta: -6,
            safetyDelta: +12,
            exposureDelta: +10,
            critique: "Direct physical presence often discourages opportunists who rely on perceived isolation.",
            potentialBenefits: [
              "Deters further escalation simply by removing privacy"
            ],
            potentialRisks: [
              "Harasser may continue verbal badgering quietly"
            ],
            recommendedNextStep: "Speak up with a casual distraction."
          },
          Direct: {
            d: "Direct",
            label: "Confront: 'Leave Her Alone'",
            actionText: "I step right up to the bench and say loudly: 'She told you three times she doesn't want to talk to you. Back off.'",
            targetSceneId: "bus_street_confront",
            tensionDelta: +26,
            safetyDelta: +6,
            exposureDelta: +38,
            critique: "Direct confrontation on a deserted street at night carries significant risk of physical violence or weapons.",
            potentialBenefits: [
              "Unmistakable defense of the woman's boundaries"
            ],
            potentialRisks: [
              "High risk of violent physical confrontation on an isolated street with no immediate backup"
            ],
            recommendedNextStep: "Maintain distance and avoid escalating into physical blows."
          }
        }
      },
      bus_distracted: {
        id: "bus_distracted",
        title: "Shelter Dynamic Shifted // Shared Umbrella",
        narrative: "The woman stands up immediately: 'No, the 42 hasn't come yet! It's supposed to be here in five minutes.' The stranger scowls and leans back against the glass, muttering: 'Whatever, I was just trying to be friendly.' Rain begins pouring harder, drumming loudly against the polycarbonate roof.",
        tension: 32,
        victimSafetyIndex: 78,
        bystanderExposure: 26,
        options: {
          Distract: {
            d: "Distract",
            label: "Invite into Lit Corner Grocery",
            actionText: "I say: 'It's pouring out here. The corner bodega has hot coffee and you can see the bus lights from their window. Want to wait in there?'",
            targetSceneId: "bus_bodega_safe",
            tensionDelta: -18,
            safetyDelta: +20,
            exposureDelta: -6,
            critique: "Extracts victim from the dark shelter into a staffed commercial haven.",
            potentialBenefits: ["Complete physical safety, dry shelter, active staff"],
            potentialRisks: ["None"],
            recommendedNextStep: "Walk together into the shop."
          },
          Delay: {
            d: "Delay",
            label: "Wait Together at Curb for Bus Lights",
            actionText: "We stand together under the umbrella at the curb until headlights appear down 4th Avenue.",
            targetSceneId: "bus_boarded_safely",
            tensionDelta: -16,
            safetyDelta: +18,
            exposureDelta: -4,
            critique: "Solidarity at the curb until transit arrives.",
            potentialBenefits: ["Ensures safe boarding onto bus"],
            potentialRisks: ["Exposure to heavy rain"],
            recommendedNextStep: "Let her board first and verify she is comfortable."
          }
        }
      },
      bus_bodega_refuge: {
        id: "bus_bodega_refuge",
        title: "Commercial Haven Established",
        narrative: "The bodega owner immediately nods: 'Yeah, I see him over there. Tell her to come inside right now, she can wait by the counter.' You return to the shelter and say: 'The shop owner said you're welcome to wait inside in the warm dry until the 42 pulls up.'",
        tension: 26,
        victimSafetyIndex: 86,
        bystanderExposure: 14,
        options: {
          Delay: {
            d: "Delay",
            label: "Walk Together into Bodega",
            actionText: "She gathers her bag with a grateful smile and walks with you into the shop.",
            targetSceneId: "bus_bodega_safe",
            tensionDelta: -14,
            safetyDelta: +14,
            exposureDelta: -4,
            critique: "Flawless transition to safety.",
            potentialBenefits: ["Secure sanctuary"],
            potentialRisks: ["None"],
            recommendedNextStep: "Wait until bus arrives."
          }
        }
      },
      bus_street_confront: {
        id: "bus_street_confront",
        title: "Nighttime Street Confrontation",
        narrative: "The stranger jumps to his feet, reaching into his jacket pocket with an aggressive glare: 'You want to get smart with me on my block?' The street is dark and quiet except for passing cars that do not stop. The woman drops her umbrella in fright.",
        tension: 86,
        victimSafetyIndex: 38,
        bystanderExposure: 78,
        options: {
          Distract: {
            d: "Distract",
            label: "Create Space & Announce Bus Arrival",
            actionText: "I point down the street and shout: 'Bus is here! Let's go!' and back away toward the store lights.",
            targetSceneId: "bus_boarded_safely",
            tensionDelta: -30,
            safetyDelta: +32,
            exposureDelta: -25,
            critique: "Quick tactical deception pulls everyone out of the kill zone.",
            potentialBenefits: ["De-escalates physical standoff"],
            potentialRisks: ["Brief confusion"],
            recommendedNextStep: "Get into the illuminated shop or approaching vehicle."
          }
        }
      },
      bus_documented: {
        id: "bus_documented",
        title: "Photo Logged // Standoff Unchanged",
        narrative: "You have recorded the shelter details, but the man has now placed his hand on the bench behind the woman's shoulders, leaning in closer. She is visibly shaking.",
        tension: 56,
        victimSafetyIndex: 40,
        bystanderExposure: 22,
        options: {
          Distract: {
            d: "Distract",
            label: "Loudly Ask for Directions to Metro",
            actionText: "I step under the shelter shaking my umbrella loudly: 'Excuse me! Is this the stop for the central transit interchange?'",
            targetSceneId: "bus_distracted",
            tensionDelta: -18,
            safetyDelta: +26,
            exposureDelta: +8,
            critique: "Energetic distraction immediately stops the physical advance.",
            potentialBenefits: ["Forces space between them"],
            potentialRisks: ["Moderate"],
            recommendedNextStep: "Invite her to walk to the grocery store."
          }
        }
      },
      bus_delayed: {
        id: "bus_delayed",
        title: "Curbside Guard // Bus Headlights Visible",
        narrative: "Standing tall by the curb, your umbrella catches the headlights of the oncoming 42 bus two blocks away. The stranger realizes his time is up, spits on the pavement, and walks away down Pine Street.",
        tension: 28,
        victimSafetyIndex: 82,
        bystanderExposure: 18,
        options: {
          Delay: {
            d: "Delay",
            label: "Board Bus Together",
            actionText: "As the bus brakes and doors hiss open, I gesture for her to board first and ask: 'Are you doing alright now?'",
            targetSceneId: "bus_boarded_safely",
            tensionDelta: -14,
            safetyDelta: +18,
            exposureDelta: -6,
            critique: "Completes the safe transition without hovering or demanding gratitude.",
            potentialBenefits: ["Safe transit onto populated bus"],
            potentialRisks: ["None"],
            recommendedNextStep: "Sit a respectful distance away unless invited."
          }
        }
      },
      bus_bodega_safe: {
        id: "bus_bodega_safe",
        isEnding: true,
        endingType: "Community Safe Haven",
        title: "Bodega Sanctuary // Safe Arrival",
        narrative: "Inside the brightly lit bodega, the woman warms up with tea while the shopkeeper keeps an eye out. When the 42 bus pulls up at the curb, the driver waits as she safely steps on. She waves through the bus window with profound relief. You demonstrated that bystander intervention is about finding practical safety, not personal ego.",
        tension: 12,
        victimSafetyIndex: 98,
        bystanderExposure: 10,
        readinessScore: 97,
        interventionStyle: "Community Haven Delegator",
        strengths: [
          "Recognized local business as an effective commercial safe haven",
          "Minimized nighttime street vulnerability through smart delegation and distraction"
        ],
        improvements: [
          "Remind others to check transit tracking apps before standing alone in isolated shelters"
        ],
        reflectionQuestion: "Why are local storefronts and corner bodegas such powerful allies in urban de-escalation?"
      },
      bus_boarded_safely: {
        id: "bus_boarded_safely",
        isEnding: true,
        endingType: "Transit Departure De-escalation",
        title: "Transit Arrival // Safe Transit",
        narrative: "Both of you board the warmly lit 42 bus. The driver pulls away from the curbside shelter into traffic. The woman sits in the front row, takes a deep breath, and whispers: 'Thank you for stepping in. Standing out there in the dark with him was terrifying.' You nod politely, take a seat nearby, and ensure she has a quiet commute.",
        tension: 16,
        victimSafetyIndex: 94,
        bystanderExposure: 14,
        readinessScore: 92,
        interventionStyle: "Watchful Protector",
        strengths: [
          "Maintained protective presence without provoking street violence",
          "Timed the transition perfectly with bus arrival"
        ],
        improvements: [
          "Keep checking for emergency exit routes when standing on dark street corners"
        ],
        reflectionQuestion: "How does creating a shared public presence neutralize street predators who depend on isolation?"
      }
    }
  }
];

export function getScenarioById(id) {
  return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
}
