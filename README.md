# Code2Art: Is My Code Art?

Transform your intellectual property into a masterpiece!
100% Local Processing. Zero Server Uploads.

## 🎨 주요 기능 (Features)
- **로컬 코드 분석 (Local AST Parsing)**: JS/TS, Python, Java 등 다양한 언어의 복잡도, 응집도, 결합도, 일관성을 서버 전송 없이 브라우저 단에서 즉시 분석합니다.
- **제너러티브 아트 렌더링 (p5.js)**: 분석된 수치를 수학적 시드로 활용하여 몬드리안, 잭슨 폴록, 피카소 등 다양한 거장들의 화풍으로 추상 아트를 생성합니다.
- **최첨단 AI 마스터피스 렌더링**: **OpenAI (DALL-E 3)** 와 **Google Gemini (3.1 Flash)** 를 연동하여, 추출된 코드의 구조적 특징을 기반으로 배경/액자 없는 완벽한 고화질 갤러리 아트워크 명화를 즉각적으로 생성해 줍니다. 

## 예시 코드 (Test Cases)

코드2아트는 코드의 문법 구조(AST, Heuristics)에 따라 복잡도, 응집도, 결합도, 일관성을 수치화하여 그림을 그립니다. 다양한 형태의 코드로 아트워크의 변화를 확인해보세요!

### 1. 거칠고 복잡한 코드 (액션 페인팅 / 잭슨 폴록 추천)
과도한 분기문, 많은 로직이 엉켜있는 전형적인 스파게티 코드입니다. 폴록 스타일로 렌더링하면 캔버스를 꽉 채우는 광기어린 흩뿌림과 거친 획을 볼 수 있습니다.

```javascript
function calculateEverything(data, type, isSuperUser, useCache) {
    let result = 0;
    if (useCache && window.localStorage.getItem('cache')) {
        result = parseInt(window.localStorage.getItem('cache'), 10);
    } else {
        if (type === 'A') {
            for (let i = 0; i < data.length; i++) {
                if (data[i] > 10) {
                    if (isSuperUser) { result += data[i] * 2; }
                    else { result += data[i]; }
                } else if (data[i] < 0) {
                    result -= data[i] * 3;
                }
            }
        } else if (type === 'B') {
            global.trackEvent('Type B logic started');
            data.forEach(item => {
                switch(item.status) {
                    case 1: result += 100; break;
                    case 2: result += 200; break;
                    case 3: result += 500; break;
                    default: result += 10;
                }
            });
        }
    }
    document.title = "Result: " + result;
    return result;
}
```

### 2. 정제되고 미니멀한 코드 (도형적 추상 / 몬드리안 추천)
깔끔하게 분리된 모듈, 분기문이 없는 선언적인 코드입니다. 몬드리안 스타일로 렌더링하면 여백의 미가 돋보이는 단순하고 완벽한 기하학적 그리드를 볼 수 있습니다.

```typescript
import { calculateSum } from './utils/math';
import { formatCurrency } from './utils/format';
import { ApiClient } from './api/client';

export class OrderProcessor {
    private api: ApiClient;

    constructor() {
        this.api = new ApiClient();
    }

    public async processOrder(items: number[]): Promise<string> {
        const totalAmount = calculateSum(items);
        await this.api.post('/orders', { total: totalAmount });
        return formatCurrency(totalAmount);
    }
    
    public getProcessorId(): string {
        return "PROC-V1";
    }
}
```

### 3. 유틸리티성 함수들의 모음 (서정적 추상 / 피카소 추천)
특정 모듈에 작은 함수들이 오밀조밀 모여있는 형태입니다. 피카소 스타일을 렌더링하면 작고 다양한 다각형들이 교차하며 재밌는 패턴을 만듭니다.

```python
import math
import re

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
    
def multiply(a, b):
    return a * b

def safe_divide(a, b):
    return a / b if b != 0 else 0

def is_valid_email(email):
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))
    
def calculate_circle_area(radius):
    return math.pi * (radius ** 2)
```
