import SwiftUI

struct IdeaCardView: View {
    let idea: Idea
    
    var stageGradient: LinearGradient {
        switch idea.stageGate {
        case .idea:
            return LinearGradient(colors: [Color(red: 0.4, green: 0.5, blue: 0.92), Color(red: 0.46, green: 0.29, blue: 0.64)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .inDevelopment:
            return LinearGradient(colors: [Color(red: 0.98, green: 0.44, blue: 0.6), Color(red: 0.96, green: 0.84, blue: 0.25)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .launched:
            return LinearGradient(colors: [Color(red: 0.26, green: 0.91, blue: 0.48), Color(red: 0.22, green: 0.98, blue: 0.84)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .sidelined:
            return LinearGradient(colors: [Color.gray, Color.gray.opacity(0.7)], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Gradient Header
            ZStack(alignment: .topLeading) {
                stageGradient
                    .frame(height: 80)
                
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text("#\(idea.ideaNumber)")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white.opacity(0.9))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(12)
                        
                        Spacer()
                        
                        Text(idea.stageGate.displayName)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(12)
                    }
                }
                .padding(12)
            }
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(idea.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(idea.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
                
                if let opportunity = idea.opportunity {
                    HStack(spacing: 4) {
                        Text("💰")
                        Text(opportunity)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(.green)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.green.opacity(0.1))
                    .cornerRadius(8)
                }
                
                if !idea.tagArray.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(idea.tagArray.prefix(2), id: \.self) { tag in
                                Text(tag)
                                    .font(.caption2)
                                    .foregroundColor(.blue)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.blue.opacity(0.1))
                                    .cornerRadius(8)
                            }
                            if idea.tagArray.count > 2 {
                                Text("+\(idea.tagArray.count - 2)")
                                    .font(.caption2)
                                    .foregroundColor(.gray)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color.gray.opacity(0.1))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                
                HStack {
                    Image(systemName: "calendar")
                        .font(.caption2)
                    Text(idea.createdAt, style: .date)
                        .font(.caption2)
                    
                    Spacer()
                    
                    if !idea.collaborators.isEmpty {
                        Image(systemName: "person.2")
                            .font(.caption2)
                        Text("\(idea.collaborators.count + 1)")
                            .font(.caption2)
                    }
                }
                .foregroundColor(.secondary)
            }
            .padding(12)
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.08), radius: 8, x: 0, y: 4)
    }
}
