import{g as e}from"./apollo-BxVF6eGb.js";const a=n=>e`
    query getAggregatedResultsAcrossEntity_${n}(
        $groupBy: [ComplianceAggregation_Scope!]
        $unit: ComplianceAggregation_Scope!
        $where: String
    ) {
        results: aggregatedResults(groupBy: $groupBy, unit: $unit, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        controls: aggregatedResults(groupBy: $groupBy, unit: CONTROL, where: $where) {
            results {
                __typename
                aggregationKeys {
                    __typename
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        complianceStandards: complianceStandards {
            id
            name
        }
    }
`,i=e`
    query getAggregatedResults(
        $groupBy: [ComplianceAggregation_Scope!]
        $unit: ComplianceAggregation_Scope!
        $where: String
    ) {
        results: aggregatedResults(groupBy: $groupBy, unit: $unit, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        controls: aggregatedResults(groupBy: $groupBy, unit: CONTROL, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        complianceStandards: complianceStandards {
            id
            name
        }
        clusters {
            id
            name
            namespaces {
                metadata {
                    id
                    name
                }
            }
            nodes {
                id
                name
            }
        }
        deployments {
            id
            name
        }
    }
`,g=e`
    query getAggregatedResults($groupBy: [ComplianceAggregation_Scope!], $where: String) {
        controls: aggregatedResults(groupBy: $groupBy, unit: CONTROL, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        complianceStandards: complianceStandards {
            id
            name
        }
    }
`,r=n=>e`
    query getAggregatedResultsByEntity_${n}(
        $groupBy: [ComplianceAggregation_Scope!]
        $unit: ComplianceAggregation_Scope!
        $where: String
    ) {
        results: aggregatedResults(groupBy: $groupBy, unit: $unit, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        controls: aggregatedResults(groupBy: $groupBy, unit: CONTROL, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        complianceStandards: complianceStandards {
            id
            name
        }
        clusters: complianceClusters {
            id
            name
        }
    }
`;e`
    query getAggregatedResults(
        $groupBy: [ComplianceAggregation_Scope!]
        $unit: ComplianceAggregation_Scope!
        $where: String!
    ) {
        results: aggregatedResults(groupBy: $groupBy, unit: $unit, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                numFailing
                numPassing
                numSkipped
                unit
            }
        }
        complianceStandards {
            id
            name
            controls {
                id
                name
                description
            }
        }
    }
`;const s=e`
    query getControlName($id: ID!) {
        control: complianceControl(id: $id) {
            id
            name
            description
        }
    }
`,o=e`
    query controlById($id: ID!, $groupBy: [ComplianceAggregation_Scope!], $where: String) {
        results: complianceControl(id: $id) {
            interpretationText
            description
            id
            name
            standardId
        }

        complianceStandards {
            id
            name
        }

        entities: aggregatedResults(groupBy: $groupBy, unit: CONTROL, where: $where) {
            results {
                aggregationKeys {
                    id
                    scope
                }
                keys {
                    ... on ComplianceDomain_Node {
                        clusterName
                        id
                        name
                    }
                }
                numFailing
                numPassing
                numSkipped
            }
        }
    }
`,u=e`
    fragment controlFields on ControlResult {
        resource {
            __typename
        }
        control {
            id
            standardId
            name
            description
        }
        value {
            overallState
        }
    }
`;export{r as A,o as C,a,i as b,u as c,g as d,s as e};
