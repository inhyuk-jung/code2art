# Code2Art: Is My Code Art? 🎨✨

**당신의 코드는 예술이 될 준비가 되었나요?**
Code2Art는 코드의 구조와 로직을 분석하여 거장들의 화풍으로 재해석된 고화질 추상 화를 생성해주는 혁신적인 서비스입니다.

100% 로컬 분석. 데이터 서버 전송 없음. 오직 당신만을 위한 마스터피스.

---

## 🚀 핵심 기능 (Features)

### 1. 지능형 코드 분석 (Deep Code Analysis)
- **로컬 AST 파싱**: 서버로 코드를 전송하지 않고 브라우저 내에서 직접 JavaScript, TypeScript, Python, Java 등 다양한 언어의 구조를 분석합니다.
- **8대 예술 지표 추출**: 복잡도(Complexity), 응집도(Cohesion), 결합도(Coupling), 가독성(Readability) 등 8가지 지표를 수치화하여 예술적 시드로 변환합니다.

### 2. 거장들의 화풍 (Masterpiece Styles)
- **[Auto] AI 자동 선택**: 코드의 성격을 실시간으로 분석하여 가장 잘 어울리는 화풍을 자동으로 추천합니다.
- **바실리 칸딘스키 (Wassily Kandinsky)**: 점, 선, 면의 음악적 구성과 정밀한 기하학적 추상.
- **빈센트 반 고흐 (Vincent van Gogh)**: 격정적인 소용돌이 붓터치와 강렬한 감정적 에너지.
- **클로드 모네 (Claude Monet)**: 빛의 떨림과 부드러운 색채가 번지는 서정적인 인상주의.
- **살바도르 달리 (Salvador Dalí)**: 시공간을 초월한 초현실주의적 구성과 정교한 묘사.
- **장 미셸 바스키아 (Jean-Michel Basquiat)**: 거칠고 낙서와 원색의 폭발, 날것의 도시 에너지가 담긴 신표현주의.

### 3. 아트봇 & AI 도슨트 (ArtBot & AI Docent)
- **애니메이팅 아트봇**: 작품이 탄생하는 과정을 3단계(분석-페인팅-감상)로 보여주는 귀여운 로봇 애니메이션을 제공합니다.
- **AI 도슨트 해설**: 생성된 작품이 코드의 어떤 특징(Complexity, Readability 등)을 반영하고 있는지 예술 비평가의 시선으로 해설해 줍니다.

---

## 🛠️ 예시 코드 (Test Cases)

### 1. 정제된 추상 아키텍처 (칸딘스키 / 모네 추천)
클래스 기반의 추상화와 깔끔한 인터페이스, 높은 응집도를 보여주는 코드입니다. 기하학적이고 균형 잡힌 칸딘스키 화풍이나 부드러운 모네 화풍으로 아름답게 변환됩니다.

```typescript
/**
 * 추상 지오메트리 오케스트레이터
 * 높은 가독성과 명확한 모듈화를 통해 조화로운 예술적 시드를 생성합니다.
 */
interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

class Circle implements Drawable {
  constructor(private x: number, private y: number, private radius: number) {}
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export class ArtGenerativeSystem {
  private elements: Drawable[] = [];

  public addElement(element: Drawable): void {
    this.elements.push(element);
  }

  public renderAll(ctx: CanvasRenderingContext2D): void {
    console.log(`Rendering ${this.elements.length} elements with precision.`);
    this.elements.forEach(el => el.draw(ctx));
  }

  public static async main() {
    const system = new ArtGenerativeSystem();
    system.addElement(new Circle(100, 100, 50));
    system.addElement(new Circle(250, 200, 30));
    
    const context = {} as CanvasRenderingContext2D; // Mock context
    system.renderAll(context);
    return "System refinement complete.";
  }
}

// Entry point
ArtGenerativeSystem.main().then(res => console.log(res));
```

### 2. 역동적인 데이터 스트림 (반 고흐 / 달리 추천)
연속적인 데이터 처리 로직과 적당한 복잡도를 가진 Python 예제입니다. 일정한 리듬감과 흐름이 강조되어 소용돌이치는 고흐의 붓터치와 매칭됩니다.

```python
import math
import time

class DataStreamProcessor:
    """
    연속적인 데이터 흐름을 처리하는 엔진입니다.
    적절한 흐름(Readability)과 중간 수준의 복잡도(Complexity)를 가집니다.
    """
    def __init__(self, stream_id):
        self.stream_id = stream_id
        self.history = []

    def process_signal(self, raw_value):
        # 복잡하지만 규칙적인 리듬을 생성하는 수학적 변환
        normalized = math.sin(raw_value) * math.cos(raw_value / 2)
        smoothed = (sum(self.history[-5:]) + normalized) / 6 if self.history else normalized
        
        self.history.append(smoothed)
        if len(self.history) > 100: self.history.pop(0)
        
        return f"Signal[{self.stream_id}]: {smoothed:.4f}"

    def run_pipeline(self, cycles=10):
        print(f"Starting pipeline {self.stream_id}...")
        for i in range(cycles):
            signal = self.process_signal(i * 1.5)
            print(f"Cycle {i}: {signal}")
            time.sleep(0.01)

def main():
    # 메인 실행부: 로직의 흐름이 명확히 보입니다.
    engine = DataStreamProcessor("VORTEX_CORE")
    engine.run_pipeline(20)
    print("Stream analysis finished.")

if __name__ == "__main__":
    main()
```

### 3. 최악의 혼돈 소스: 레거시의 비명 (바스키아 추천)
극도로 높은 복잡도, 낮은 가독성, 그리고 엉망인 응집도를 가진 '스파게티의 정수' 코드입니다. 캔버스가 비명 지르는 듯한 도시적 혼란과 날것의 폭발을 감상할 수 있습니다.

```javascript
/**
 * 전설의 레거시 스파게티 함수
 * 복잡도 0.95, 가독성 0.1의 예술적 폭발력을 경험해보세요.
 */
function processUglyLegacyChaos(a, b, c, d, e, f) {
    var _0x123 = []; 
    console.log("Initializing hell version 2.0...");
    
    if (a > 10) {
        for (var i = 0; i < 100; i++) {
            if (i % 2 === 0) {
                while (b > 0) {
                    try { 
                        if (c) { 
                            b--; 
                            d.push(i + a); 
                            if (d.length > 50) {
                                (function(temp){
                                    eval("var chaos = " + temp + "; window.lastVal = chaos;");
                                })(d[0]);
                            }
                        } 
                    } catch (err) { 
                        b += 1; 
                        a *= 1.1; 
                        console.error("CRITICAL_VOID: " + err);
                    } finally { 
                        a = Math.sqrt(Math.abs(a - i)); 
                        _0x123.push(function(x){ 
                            return x * a + Math.random() + (function(y){ return y * y; })(i); 
                        });
                    }
                }
            } else {
                // 의미 없는 분기들의 중첩
                if (a < 5) {
                    if (b > 10) {
                        return "Early Exit Disaster";
                    }
                }
            }
        }
    } else {
        return (function(p){ 
            return p.split("").reverse().map(function(char){
                return String.fromCharCode(char.charCodeAt(0) ^ 0x42);
            }).join("");
        })("PLEASE_DECODE_THIS_PAIN_IMMEDIATELY");
    }
    
    // 복잡한 연산의 집합체
    return _0x123.reduce((acc, fn) => acc + fn(Math.random()), 0) / (a || 1);
}

// 실행부 (어디서 실행되는지도 모를 불분명한 맥락)
var result = processUglyLegacyChaos(15, 10, true, [], {}, function(x){ return x > 0; });
console.log("Chaos result: " + result);
```

---

## 📦 시작하기 (Get Started)

1. 저장소를 클론합니다.
2. `npm install` 로 의존성을 설치합니다.
3. `.env.local` 파일에 `NEXT_PUBLIC_OPENAI_KEY` 또는 `NEXT_PUBLIC_GEMINI_KEY`를 설정합니다.
4. `npm run dev` 로 로컬 개발 서버를 실행합니다.

---

*당신의 코드가 단순한 로직을 넘어, 하나의 예술이 되는 순간을 함께하세요.* ✍️✨
